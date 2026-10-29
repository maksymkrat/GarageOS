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
[Route("orders")]
public class OrdersController(IOrderService orders) : ControllerBase
{
    private const long MaxPhotoBytes = 10 * 1024 * 1024;

    [HttpGet]
    public Task<IReadOnlyList<OrderDto>> GetAll(
        [FromQuery] bool includeLines,
        CancellationToken ct) =>
        orders.GetOrdersAsync(includeLines, ct);

    [HttpGet("{id:int}")]
    public Task<OrderDetailDto> GetById(int id, CancellationToken ct) =>
        orders.GetOrderDetailAsync(id, ct);

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(
        CreateOrderRequest request,
        CancellationToken ct)
    {
        var order = await orders.CreateOrderAsync(request, ct);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPut("{id:int}")]
    public Task<OrderDto> Update(int id, UpdateOrderRequest request, CancellationToken ct) =>
        orders.UpdateOrderAsync(id, request, ct);

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await orders.DeleteOrderAsync(id, ct);

        return NoContent();
    }

    [HttpPost("{id:int}/photos")]
    [RequestSizeLimit(MaxPhotoBytes)]
    public async Task<ActionResult<OrderPhotoDto>> AddPhoto(
        int id,
        [FromForm] IFormFile file,
        CancellationToken ct)
    {
        if (file.Length == 0) throw new BadRequestException("Файл порожній.");

        using var buffer = new MemoryStream();

        await file.CopyToAsync(buffer, ct);
        buffer.Position = 0;

        var photo = await orders.AddPhotoAsync(id, buffer, ct);

        return CreatedAtAction(nameof(GetById), new { id }, photo);
    }

    [HttpDelete("{id:int}/photos/{photoId:int}")]
    public async Task<IActionResult> DeletePhoto(int id, int photoId, CancellationToken ct)
    {
        await orders.DeletePhotoAsync(id, photoId, ct);

        return NoContent();
    }

    [HttpGet("{id:int}/photos/{photoId:int}")]
    public async Task<IActionResult> GetPhoto(
        int id,
        int photoId,
        [FromQuery] string? size,
        CancellationToken ct)
    {
        var photo = await orders.GetPhotoAsync(
            id,
            photoId,
            ContractFormat.ParsePhotoSize(size),
            ct);

        Response.Headers.CacheControl = "private, max-age=31536000, immutable";

        return File(photo.Content, photo.ContentType);
    }

    [HttpPost("{id:int}/pay")]
    public Task<OrderDetailDto> Pay(int id, CancellationToken ct) =>
        orders.PayOrderAsync(id, ct);

    [HttpPost("{id:int}/works")]
    public async Task<ActionResult<OrderWorkDto>> AddWork(
        int id,
        OrderWorkRequest request,
        CancellationToken ct)
    {
        var work = await orders.AddWorkAsync(id, request, ct);

        return CreatedAtAction(nameof(GetById), new { id }, work);
    }

    [HttpPut("{id:int}/works/{workId:int}")]
    public Task<OrderWorkDto> UpdateWork(
        int id,
        int workId,
        OrderWorkRequest request,
        CancellationToken ct) =>
        orders.UpdateWorkAsync(id, workId, request, ct);

    [HttpDelete("{id:int}/works/{workId:int}")]
    public async Task<IActionResult> DeleteWork(int id, int workId, CancellationToken ct)
    {
        await orders.DeleteWorkAsync(id, workId, ct);

        return NoContent();
    }

    [HttpPost("{id:int}/parts")]
    public async Task<ActionResult<OrderPartDto>> AddPart(
        int id,
        OrderPartRequest request,
        CancellationToken ct)
    {
        var part = await orders.AddPartAsync(id, request, ct);

        return CreatedAtAction(nameof(GetById), new { id }, part);
    }

    [HttpPut("{id:int}/parts/{partId:int}")]
    public Task<OrderPartDto> UpdatePart(
        int id,
        int partId,
        OrderPartRequest request,
        CancellationToken ct) =>
        orders.UpdatePartAsync(id, partId, request, ct);

    [HttpDelete("{id:int}/parts/{partId:int}")]
    public async Task<IActionResult> DeletePart(int id, int partId, CancellationToken ct)
    {
        await orders.DeletePartAsync(id, partId, ct);

        return NoContent();
    }
}
