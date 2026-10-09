using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Route("cars")]
public class CarsController(ICarService cars) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<CarDto>> GetAll(CancellationToken ct) => cars.GetCarsAsync(ct);

    [HttpGet("{id:int}")]
    public Task<CarDetailDto> GetById(int id, CancellationToken ct) => cars.GetCarDetailAsync(id, ct);

    [HttpPost]
    public async Task<ActionResult<CarDto>> Create(CreateCarRequest request, CancellationToken ct)
    {
        var car = await cars.CreateCarAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
    }
}
