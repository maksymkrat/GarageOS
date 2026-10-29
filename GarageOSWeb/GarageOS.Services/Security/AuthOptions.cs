namespace GarageOS.Services.Security;

public sealed class JwtOptions
{
    public const string Section = "Jwt";

    public string Key { get; set; } = string.Empty;

    public string Issuer { get; set; } = "GarageOS";
    public string Audience { get; set; } = "GarageOSMobile";

    public TimeSpan AccessLifetime { get; set; } = TimeSpan.FromMinutes(15);

    public TimeSpan RefreshLifetime { get; set; } = TimeSpan.FromHours(14);
}

public sealed class TelegramOptions
{
    public const string Section = "Telegram";

    public string BotToken { get; set; } = string.Empty;

    public long OwnerId { get; set; }

    public string BotUsername { get; set; } = string.Empty;
}

public sealed class LoginCodeOptions
{
    public const string Section = "LoginCode";

    public int Digits { get; set; } = 6;

    public TimeSpan Lifetime { get; set; } = TimeSpan.FromMinutes(5);

    public int MaxAttempts { get; set; } = 5;

    public TimeSpan ResendDelay { get; set; } = TimeSpan.FromSeconds(60);
}
