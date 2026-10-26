using GarageOS.Services.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Infrastructure;

public sealed class AuthExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct)
    {
        var status = exception switch
        {
            UnauthorizedException => StatusCodes.Status401Unauthorized,
            TooManyRequestsException => StatusCodes.Status429TooManyRequests,
            _ => 0
        };

        if (status == 0) return false;

        context.Response.StatusCode = status;

        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = status,
            Detail = exception.Message,
            Instance = $"{context.Request.Method} {context.Request.Path}"
        }, ct);

        return true;
    }
}
