using GarageOS.Api.Infrastructure;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace GarageOS.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(IAuthService auth) : ControllerBase
{
    [HttpGet("bot")]
    public BotInfoDto Bot() => auth.GetBotInfo();

    [HttpPost("request-code")]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public async Task<IActionResult> RequestCode(RequestCodeRequest request, CancellationToken ct)
    {
        await auth.RequestCodeAsync(request, ct);

        return Accepted();
    }

    [HttpPost("verify")]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public Task<SessionDto> Verify(VerifyCodeRequest request, CancellationToken ct) =>
        auth.VerifyCodeAsync(request, ct);

    [HttpPost("refresh")]
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    public Task<SessionDto> Refresh(RefreshRequest request, CancellationToken ct) =>
        auth.RefreshAsync(request, ct);

    [HttpPost("sign-out")]
    [Authorize]
    public async Task<IActionResult> SignOutSession(CancellationToken ct)
    {
        await auth.SignOutAsync(User.UserId(), ct);

        return NoContent();
    }
}
