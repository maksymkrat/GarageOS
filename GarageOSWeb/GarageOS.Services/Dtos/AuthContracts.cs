namespace GarageOS.Services.Dtos;

public sealed record RequestCodeRequest(string Phone);

public sealed record VerifyCodeRequest(string Phone, string Code);

public sealed record RefreshRequest(string RefreshToken);

public sealed record BotInfoDto(string Username);

public sealed record UserProfileDto(int Id, string FirstName, string? LastName, string Phone);

public sealed record SessionDto(
    string AccessToken,
    string RefreshToken,
    int ExpiresIn,
    bool Master,
    UserProfileDto User);
