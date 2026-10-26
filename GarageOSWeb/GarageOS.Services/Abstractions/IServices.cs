using GarageOS.Domain.Enums;
using GarageOS.Services.Dtos;

namespace GarageOS.Services.Abstractions;

public interface IClientVehicleService
{
    Task<IReadOnlyList<ClientVehicleDto>> GetVehiclesAsync(CancellationToken ct = default);
    Task<ClientVehicleDetailDto> GetVehicleDetailAsync(int id, CancellationToken ct = default);
    Task<ClientVehicleDto> CreateVehicleAsync(CreateClientVehicleRequest request, CancellationToken ct = default);
    Task<ClientVehicleDto> UpdateStatusAsync(int id, UpdateClientVehicleStatusRequest request, CancellationToken ct = default);
    Task<ClientVehicleDetailDto> PayVehicleAsync(int id, CancellationToken ct = default);

    Task<ClientVehicleDto> SetPhotoAsync(int id, Stream upload, CancellationToken ct = default);
    Task<ClientVehicleDto> DeletePhotoAsync(int id, CancellationToken ct = default);
    Task<StoredPhoto> GetPhotoAsync(int id, Guid photoId, PhotoSize size, CancellationToken ct = default);
}

public interface IOrderService
{
    Task<IReadOnlyList<OrderDto>> GetOrdersAsync(bool includeLines, CancellationToken ct = default);
    Task<OrderDetailDto> GetOrderDetailAsync(int id, CancellationToken ct = default);
    Task<OrderDto> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct = default);
    Task<OrderDto> UpdateOrderAsync(int id, UpdateOrderRequest request, CancellationToken ct = default);
    Task DeleteOrderAsync(int id, CancellationToken ct = default);
    Task<OrderDetailDto> PayOrderAsync(int id, CancellationToken ct = default);

    Task<OrderPhotoDto> AddPhotoAsync(int orderId, Stream upload, CancellationToken ct = default);
    Task DeletePhotoAsync(int orderId, int photoId, CancellationToken ct = default);
    Task<StoredPhoto> GetPhotoAsync(int orderId, int photoId, PhotoSize size, CancellationToken ct = default);

    Task<OrderWorkDto> AddWorkAsync(int orderId, OrderWorkRequest request, CancellationToken ct = default);
    Task<OrderWorkDto> UpdateWorkAsync(int orderId, int workId, OrderWorkRequest request, CancellationToken ct = default);
    Task DeleteWorkAsync(int orderId, int workId, CancellationToken ct = default);

    Task<OrderPartDto> AddPartAsync(int orderId, OrderPartRequest request, CancellationToken ct = default);
    Task<OrderPartDto> UpdatePartAsync(int orderId, int partId, OrderPartRequest request, CancellationToken ct = default);
    Task DeletePartAsync(int orderId, int partId, CancellationToken ct = default);
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
    Task<IReadOnlyList<MyVehicleDto>> GetVehiclesAsync(int userId, bool includeLog, CancellationToken ct = default);
    Task<MyVehicleDto> GetVehicleAsync(int userId, int id, bool includeLog, CancellationToken ct = default);
    Task<MyVehicleDto> CreateVehicleAsync(int userId, CreateMyVehicleRequest request, CancellationToken ct = default);
    Task<MyVehicleDto> UpdateVehicleAsync(int userId, int id, UpdateMyVehicleRequest request, CancellationToken ct = default);
    Task DeleteVehicleAsync(int userId, int id, CancellationToken ct = default);
    Task<LogEntryDto> AddLogEntryAsync(int userId, int vehicleId, CreateLogEntryRequest request, CancellationToken ct = default);
    Task<LogEntryDto> UpdateLogEntryAsync(int userId, int vehicleId, int entryId, UpdateLogEntryRequest request, CancellationToken ct = default);
    Task DeleteLogEntryAsync(int userId, int vehicleId, int entryId, CancellationToken ct = default);

    Task<MyVehicleDto> SetPhotoAsync(int userId, int id, Stream upload, CancellationToken ct = default);
    Task<MyVehicleDto> DeletePhotoAsync(int userId, int id, CancellationToken ct = default);
    Task<StoredPhoto> GetPhotoAsync(int userId, int id, Guid photoId, PhotoSize size, CancellationToken ct = default);
}
