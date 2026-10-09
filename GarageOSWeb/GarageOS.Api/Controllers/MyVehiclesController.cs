using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

/// <summary>Шлях саме <c>my-vehicles</c>, хоч ключ кешу на клієнті — vehicles.</summary>
[ApiController]
[Route("my-vehicles")]
public class MyVehiclesController(IMyVehicleService vehicles) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<MyVehicleDto>> GetAll(CancellationToken ct) =>
        vehicles.GetVehiclesAsync(ct);

    [HttpGet("{id:int}")]
    public Task<MyVehicleDto> GetById(int id, CancellationToken ct) =>
        vehicles.GetVehicleAsync(id, ct);
}
