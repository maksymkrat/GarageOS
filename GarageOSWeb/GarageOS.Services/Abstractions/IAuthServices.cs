using GarageOS.Services.Dtos;

namespace GarageOS.Services.Abstractions;

public interface IAuthService
{
    Task RequestCodeAsync(RequestCodeRequest request, CancellationToken ct = default);

    Task<SessionDto> VerifyCodeAsync(VerifyCodeRequest request, CancellationToken ct = default);

    Task<SessionDto> RefreshAsync(RefreshRequest request, CancellationToken ct = default);

    Task SignOutAsync(int userId, CancellationToken ct = default);

    BotInfoDto GetBotInfo();
}

public enum StartOutcome
{
    NeedsPhone,

    AlreadyActivated
}

public enum ContactOutcome
{
    Activated,
    AlreadyActivated,

    Rejected,

    PhoneTaken
}

public sealed record TelegramContact(
    long TelegramId,
    long ContactUserId,
    string PhoneNumber,
    string FirstName,
    string? LastName);

public interface ITelegramSignInService
{
    Task<StartOutcome> HandleStartAsync(long telegramId, CancellationToken ct = default);

    Task<ContactOutcome> HandleContactAsync(TelegramContact contact, CancellationToken ct = default);
}

public interface ITelegramNotifier
{
    Task SendCodeAsync(long telegramId, string code, CancellationToken ct = default);

    Task SendSignedInAsync(long telegramId, CancellationToken ct = default);
}
