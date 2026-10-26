using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;
using GarageOS.Services.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace GarageOS.Services;

public class AuthService(
    IUserRepository users,
    ILoginCodeRepository codes,
    IUnitOfWork uow,
    ITelegramNotifier telegram,
    IAccessTokenFactory accessTokens,
    IOptions<LoginCodeOptions> codeOptions,
    IOptions<JwtOptions> jwtOptions,
    IOptions<TelegramOptions> telegramOptions,
    TimeProvider time,
    ILogger<AuthService> log) : IAuthService
{
    private const string NotActivated =
        "Код не прийде на цей номер — бот не активований або заблокований. Відкрий Telegram і натисни «Почати».";

    private const string BadCode = "Код неправильний або вже не діє. Запроси новий.";

    private const string SessionGone = "Сесія завершена. Увійди знову.";

    public async Task RequestCodeAsync(RequestCodeRequest request, CancellationToken ct = default)
    {
        var phone = ContractFormat.Phone(request.Phone);
        var now = time.GetUtcNow().UtcDateTime;

        var user = await users.GetByPhoneAsync(phone, ct)
                   ?? throw new NotFoundException(NotActivated);

        var active = await codes.GetActiveByUserIdAsync(user.Id, ct);

        if (active is not null)
        {
            var since = now - active.CreatedAt;

            if (since < codeOptions.Value.ResendDelay)
            {
                var wait = (int)Math.Ceiling((codeOptions.Value.ResendDelay - since).TotalSeconds);
                throw new TooManyRequestsException($"Новий код можна запросити через {wait} с.");
            }

            active.ConsumedAt = now;
        }

        var code = Secrets.NewCode(codeOptions.Value.Digits);

        codes.Add(new LoginCodeEntity
        {
            UserId = user.Id,
            CodeHash = Secrets.Hash(code),
            ExpiresAt = now + codeOptions.Value.Lifetime
        });

        await uow.SaveChangesAsync(ct);

        try
        {
            await telegram.SendCodeAsync(user.TelegramId, code, ct);
        }
        catch (TelegramUnreachableException e)
        {
            log.LogWarning(e, "Не вдалося надіслати код у чат {TelegramId}", user.TelegramId);
            throw new NotFoundException(NotActivated);
        }
    }

    public async Task<SessionDto> VerifyCodeAsync(VerifyCodeRequest request, CancellationToken ct = default)
    {
        var phone = ContractFormat.Phone(request.Phone);
        var now = time.GetUtcNow().UtcDateTime;

        var user = await users.GetByPhoneAsync(phone, ct)
                   ?? throw new NotFoundException(NotActivated);

        var code = await codes.GetActiveByUserIdAsync(user.Id, ct)
                   ?? throw new UnauthorizedException(BadCode);

        if (code.ExpiresAt <= now || code.Attempts >= codeOptions.Value.MaxAttempts)
        {
            throw new UnauthorizedException(BadCode);
        }

        var entered = Secrets.Hash(Secrets.Digits(request.Code));

        if (!Secrets.FixedTimeEquals(entered, code.CodeHash))
        {
            await codes.RegisterFailedAttemptAsync(code.Id, now, ct);
            throw new UnauthorizedException(BadCode);
        }

        if (!await codes.TryConsumeAsync(code.Id, now, ct))
        {
            throw new UnauthorizedException(BadCode);
        }

        return await IssueSessionAsync(
            user,
            now,
            endsAt: now + jwtOptions.Value.RefreshLifetime,
            notify: true,
            ct);
    }

    public async Task<SessionDto> RefreshAsync(RefreshRequest request, CancellationToken ct = default)
    {
        var now = time.GetUtcNow().UtcDateTime;

        var user = await users.GetByRefreshTokenHashAsync(Secrets.Hash(request.RefreshToken), ct)
                   ?? throw new UnauthorizedException(SessionGone);

        if (user.RefreshExpiresAt is null || user.RefreshExpiresAt <= now)
        {
            throw new UnauthorizedException(SessionGone);
        }

        // The end of the session comes from the sign-in, not from this call:
        // refreshing keeps a day's work going, it does not start a new day.
        return await IssueSessionAsync(user, now, endsAt: user.RefreshExpiresAt.Value, notify: false, ct);
    }

    public BotInfoDto GetBotInfo() => new(telegramOptions.Value.BotUsername);

    public async Task SignOutAsync(int userId, CancellationToken ct = default)
    {
        var user = await users.GetByIdAsync(userId, ct)
                   ?? throw new NotFoundException("Акаунт не знайдено");

        user.RefreshTokenHash = null;
        user.RefreshExpiresAt = null;

        await uow.SaveChangesAsync(ct);
    }

    private async Task<SessionDto> IssueSessionAsync(
        UserEntity user,
        DateTime now,
        DateTime endsAt,
        bool notify,
        CancellationToken ct)
    {
        var refreshToken = Secrets.NewRefreshToken();

        user.RefreshTokenHash = Secrets.Hash(refreshToken);
        user.RefreshExpiresAt = endsAt;

        await uow.SaveChangesAsync(ct);

        var access = accessTokens.Create(user.Id, user.TelegramId, now);
        var isMaster = telegramOptions.Value.OwnerId != 0 && telegramOptions.Value.OwnerId == user.TelegramId;

        if (notify)
        {
            try
            {
                await telegram.SendSignedInAsync(user.TelegramId, ct);
            }
            catch (Exception e)
            {
                log.LogWarning(e, "Не вдалося повідомити про вхід у чат {TelegramId}", user.TelegramId);
            }
        }

        return new SessionDto(
            access.Value,
            refreshToken,
            (int)access.Lifetime.TotalSeconds,
            isMaster,
            new UserProfileDto(user.Id, user.FirstName, user.LastName, user.Phone));
    }
}
