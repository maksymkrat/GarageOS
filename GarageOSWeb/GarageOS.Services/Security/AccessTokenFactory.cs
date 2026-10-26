using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace GarageOS.Services.Security;

public sealed record AccessToken(string Value, TimeSpan Lifetime);

public interface IAccessTokenFactory
{
    AccessToken Create(int userId, long telegramId, DateTime now);
}

public sealed class AccessTokenFactory(
    IOptions<JwtOptions> jwtOptions,
    IOptions<TelegramOptions> telegramOptions) : IAccessTokenFactory
{
    public const string MasterClaim = "master";

    private const int MinimumKeyBytes = 32;

    private readonly JsonWebTokenHandler _handler = new();

    public AccessToken Create(int userId, long telegramId, DateTime now)
    {
        var jwt = jwtOptions.Value;

        if (Encoding.UTF8.GetByteCount(jwt.Key) < MinimumKeyBytes)
        {
            throw new InvalidOperationException(
                $"Jwt:Key коротший за {MinimumKeyBytes} байтів — для HS256 це слабше за сам підпис. " +
                "Задай довший ключ через user secrets.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));

        var isMaster = telegramOptions.Value.OwnerId != 0 && telegramOptions.Value.OwnerId == telegramId;

        var token = _handler.CreateToken(new SecurityTokenDescriptor
        {
            Issuer = jwt.Issuer,
            Audience = jwt.Audience,
            IssuedAt = now,
            NotBefore = now,
            Expires = now + jwt.AccessLifetime,
            Claims = new Dictionary<string, object>
            {
                [JwtRegisteredClaimNames.Sub] = userId.ToString(),
                [MasterClaim] = isMaster ? "true" : "false"
            },
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        });

        return new AccessToken(token, jwt.AccessLifetime);
    }
}
