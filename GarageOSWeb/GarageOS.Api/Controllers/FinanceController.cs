using GarageOS.Api.Infrastructure;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Authorize(AuthPolicies.Master)]
[Route("finance")]
public class FinanceController(IFinanceService finance) : ControllerBase
{
    [HttpGet]
    public Task<FinanceOverviewDto> Get([FromQuery] string period, CancellationToken ct) =>
        finance.GetOverviewAsync(period, ct);
}
