using GarageOS.Api.Infrastructure;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Authorize]
[Route("my-vehicles")]
public class MyVehiclesController(IMyVehicleService vehicles) : ControllerBase
{
    private const long MaxPhotoBytes = 10 * 1024 * 1024;

    [HttpGet]
    public Task<IReadOnlyList<MyVehicleDto>> GetAll(
        [FromQuery] bool includeLog,
        CancellationToken ct) =>
        vehicles.GetVehiclesAsync(User.UserId(), includeLog, ct);

    [HttpGet("{id:int}")]
    public Task<MyVehicleDto> GetById(
        int id,
        [FromQuery] bool includeLog,
        CancellationToken ct) =>
        vehicles.GetVehicleAsync(User.UserId(), id, includeLog, ct);

    [HttpPost]
    public async Task<ActionResult<MyVehicleDto>> Create(
        CreateMyVehicleRequest request,
        CancellationToken ct)
    {
        var vehicle = await vehicles.CreateVehicleAsync(User.UserId(), request, ct);

        return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
    }

    [HttpPut("{id:int}")]
    public Task<MyVehicleDto> Update(
        int id,
        UpdateMyVehicleRequest request,
        CancellationToken ct) =>
        vehicles.UpdateVehicleAsync(User.UserId(), id, request, ct);

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await vehicles.DeleteVehicleAsync(User.UserId(), id, ct);

        return NoContent();
    }

    // Same three shapes as a customer's car, only the owner comes from the
    // token instead of the Master policy (ADR-0026).
    [HttpPost("{id:int}/photo")]
    [RequestSizeLimit(MaxPhotoBytes)]
    public async Task<MyVehicleDto> SetPhoto(
        int id,
        [FromForm] IFormFile file,
        CancellationToken ct)
    {
        if (file.Length == 0) throw new BadRequestException("Файл порожній.");

        using var buffer = new MemoryStream();

        await file.CopyToAsync(buffer, ct);
        buffer.Position = 0;

        return await vehicles.SetPhotoAsync(User.UserId(), id, buffer, ct);
    }

    [HttpDelete("{id:int}/photo")]
    public Task<MyVehicleDto> DeletePhoto(int id, CancellationToken ct) =>
        vehicles.DeletePhotoAsync(User.UserId(), id, ct);

    [HttpGet("{id:int}/photo/{photoId:guid}")]
    public async Task<IActionResult> GetPhoto(
        int id,
        Guid photoId,
        [FromQuery] string? size,
        CancellationToken ct)
    {
        var photo = await vehicles.GetPhotoAsync(
            User.UserId(),
            id,
            photoId,
            ContractFormat.ParsePhotoSize(size),
            ct);

        Response.Headers.CacheControl = "private, max-age=31536000, immutable";

        return File(photo.Content, photo.ContentType);
    }

    // A log entry has no URL of its own, so Location points at the vehicle,
    // which is where the entry becomes readable.
    [HttpPost("{id:int}/log")]
    public async Task<ActionResult<LogEntryDto>> AddLogEntry(
        int id,
        CreateLogEntryRequest request,
        CancellationToken ct)
    {
        var entry = await vehicles.AddLogEntryAsync(User.UserId(), id, request, ct);

        return CreatedAtAction(nameof(GetById), new { id }, entry);
    }

    [HttpPut("{id:int}/log/{entryId:int}")]
    public Task<LogEntryDto> UpdateLogEntry(
        int id,
        int entryId,
        UpdateLogEntryRequest request,
        CancellationToken ct) =>
        vehicles.UpdateLogEntryAsync(User.UserId(), id, entryId, request, ct);

    [HttpDelete("{id:int}/log/{entryId:int}")]
    public async Task<IActionResult> DeleteLogEntry(int id, int entryId, CancellationToken ct)
    {
        await vehicles.DeleteLogEntryAsync(User.UserId(), id, entryId, ct);

        return NoContent();
    }
}
