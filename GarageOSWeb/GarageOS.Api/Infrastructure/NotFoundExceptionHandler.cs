using GarageOS.Services.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Infrastructure;

/// <summary>
/// Віддає ProblemDetails у формі, яку 05-cross-cutting радить мапити в ApiError
/// на клієнті: detail -> message, status -> status, instance -> endpoint.
/// </summary>
public sealed class NotFoundExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext context,
        Exception exception,
        CancellationToken ct)
    {
        if (exception is not NotFoundException notFound) return false;

        context.Response.StatusCode = StatusCodes.Status404NotFound;

        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = StatusCodes.Status404NotFound,
            // Текст українською і показується користувачу як є.
            Detail = notFound.Message,
            Instance = $"{context.Request.Method} {context.Request.Path}"
        }, ct);

        return true;
    }
}
