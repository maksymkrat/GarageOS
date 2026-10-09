using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Route("finance")]
public class FinanceController(IFinanceService finance) : ControllerBase
{
    /// <summary>Контракт зве період query-параметром: <c>GET /finance?period=week</c>.</summary>
    [HttpGet]
    public Task<FinanceOverviewDto> Get([FromQuery] string period, CancellationToken ct) =>
        finance.GetOverviewAsync(period, ct);
}
