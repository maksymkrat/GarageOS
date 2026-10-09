using GarageOS.Services.Dtos;

namespace GarageOS.Services.Abstractions;

public interface ICarService
{
    Task<IReadOnlyList<CarDto>> GetCarsAsync(CancellationToken ct = default);
    Task<CarDetailDto> GetCarDetailAsync(int id, CancellationToken ct = default);
    Task<CarDto> CreateCarAsync(CreateCarRequest request, CancellationToken ct = default);
}

public interface IOrderService
{
    Task<IReadOnlyList<OrderDto>> GetOrdersAsync(CancellationToken ct = default);
    Task<OrderDetailDto> GetOrderDetailAsync(int id, CancellationToken ct = default);
}

public interface IReminderService
{
    Task<IReadOnlyList<ReminderItemDto>> GetRemindersAsync(CancellationToken ct = default);
}

public interface IFinanceService
{
    Task<FinanceOverviewDto> GetOverviewAsync(string period, CancellationToken ct = default);
}

public interface IMyVehicleService
{
    Task<IReadOnlyList<MyVehicleDto>> GetVehiclesAsync(CancellationToken ct = default);
    Task<MyVehicleDto> GetVehicleAsync(int id, CancellationToken ct = default);
}
