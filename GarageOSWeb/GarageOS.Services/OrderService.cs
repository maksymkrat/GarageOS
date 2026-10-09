using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;

namespace GarageOS.Services;

public class OrderService(IOrderRepository orders, ICarRepository cars) : IOrderService
{
    public async Task<IReadOnlyList<OrderDto>> GetOrdersAsync(CancellationToken ct = default)
    {
        var rows = await orders.GetAllAsync(ct);
        return [.. rows.Select(x => x.ToModel().ToDto())];
    }

    public async Task<OrderDetailDto> GetOrderDetailAsync(int id, CancellationToken ct = default)
    {
        var order = await orders.GetByIdAsync(id, ct)
                    ?? throw new NotFoundException("Наряд не знайдено");

        // Окреме повідомлення — так само, як у контракті: екран розрізняє
        // «немає наряду» і «наряд є, але авто зникло».
        var car = await cars.GetByIdAsync(order.CarId, ct)
                  ?? throw new NotFoundException("Авто наряду не знайдено");

        return new OrderDetailDto(order.ToModel().ToDto(), car.ToModel().ToDto());
    }
}
