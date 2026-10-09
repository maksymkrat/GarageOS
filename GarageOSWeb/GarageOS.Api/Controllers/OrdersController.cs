using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Route("orders")]
public class OrdersController(IOrderService orders) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<OrderDto>> GetAll(CancellationToken ct) => orders.GetOrdersAsync(ct);

    [HttpGet("{id:int}")]
    public Task<OrderDetailDto> GetById(int id, CancellationToken ct) => orders.GetOrderDetailAsync(id, ct);
}
