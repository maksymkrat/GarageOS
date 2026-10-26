using System.Security.Claims;
using GarageOS.Services.Security;

namespace GarageOS.Api.Infrastructure;

public static class AuthPolicies
{
    public const string Master = "master";
}

public static class RateLimitPolicies
{
    public const string Auth = "auth";
}

public static class ClaimsPrincipalExtensions
{
    public static int UserId(this ClaimsPrincipal principal)
    {
        var sub = principal.FindFirstValue("sub")
                  ?? throw new InvalidOperationException("У токені немає claim sub");

        return int.Parse(sub);
    }

    public static bool IsMaster(this ClaimsPrincipal principal) =>
        principal.FindFirstValue(AccessTokenFactory.MasterClaim) == "true";
}
