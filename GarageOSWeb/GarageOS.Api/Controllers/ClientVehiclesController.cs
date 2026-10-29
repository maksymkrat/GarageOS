using GarageOS.Api.Infrastructure;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Authorize(AuthPolicies.Master)]
[Route("client-vehicles")]
public class ClientVehiclesController(IClientVehicleService vehicles) : ControllerBase
{
    private const long MaxPhotoBytes = 10 * 1024 * 1024;

    [HttpGet]
    public Task<IReadOnlyList<ClientVehicleDto>> GetAll(CancellationToken ct) =>
        vehicles.GetVehiclesAsync(ct);

    [HttpGet("{id:int}")]
    public Task<ClientVehicleDetailDto> GetById(int id, CancellationToken ct) =>
        vehicles.GetVehicleDetailAsync(id, ct);

    [HttpPut("{id:int}/status")]
    public Task<ClientVehicleDto> UpdateStatus(
        int id,
        UpdateClientVehicleStatusRequest request,
        CancellationToken ct) =>
        vehicles.UpdateStatusAsync(id, request, ct);

    [HttpPost("{id:int}/photo")]
    [RequestSizeLimit(MaxPhotoBytes)]
    public async Task<ClientVehicleDto> SetPhoto(
        int id,
        [FromForm] IFormFile file,
        CancellationToken ct)
    {
        if (file.Length == 0) throw new BadRequestException("Файл порожній.");

        // Buffered first: the codec has to seek to read the header, and a
        // request stream cannot. RequestSizeLimit is what bounds this.
        using var buffer = new MemoryStream();

        await file.CopyToAsync(buffer, ct);
        buffer.Position = 0;

        return await vehicles.SetPhotoAsync(id, buffer, ct);
    }

    [HttpDelete("{id:int}/photo")]
    public Task<ClientVehicleDto> DeletePhoto(int id, CancellationToken ct) =>
        vehicles.DeletePhotoAsync(id, ct);

    [HttpGet("{id:int}/photo/{photoId:guid}")]
    public async Task<IActionResult> GetPhoto(
        int id,
        Guid photoId,
        [FromQuery] string? size,
        CancellationToken ct)
    {
        var photo = await vehicles.GetPhotoAsync(
            id,
            photoId,
            ContractFormat.ParsePhotoSize(size),
            ct);

        Response.Headers.CacheControl = "private, max-age=31536000, immutable";

        return File(photo.Content, photo.ContentType);
    }

    [HttpPost("{id:int}/pay")]
    public Task<ClientVehicleDetailDto> Pay(int id, CancellationToken ct) =>
        vehicles.PayVehicleAsync(id, ct);

    [HttpPost]
    public async Task<ActionResult<ClientVehicleDto>> Create(
        CreateClientVehicleRequest request,
        CancellationToken ct)
    {
        var vehicle = await vehicles.CreateVehicleAsync(request, ct);

        return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
    }
}
