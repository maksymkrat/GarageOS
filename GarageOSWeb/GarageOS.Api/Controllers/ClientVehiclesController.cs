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
    // The phone already shrinks the picture to about a tenth of this, so the
    // cap is here for everything else: a bad client cannot fill the disk.
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

    // Multipart, one field named `file`. The photo is cropped square and
    // re-encoded on the way in, and the answer is the card with its new
    // `photoId` (ADR-0026).
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

    // Streamed through the API rather than served as a static file: a photo of
    // a customer's car is not public, and a static URL is a public URL.
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

        // Immutable because a new picture gets a new id, hence a new URL;
        // private because the bytes are nobody else's business.
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
