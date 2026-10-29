using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IOrderRepository
{
    Task<IReadOnlyList<OrderEntity>> GetAllAsync(bool includeLines, CancellationToken ct = default);

    Task<OrderEntity?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<OrderEntity>> GetByClientVehicleIdAsync(int vehicleId, CancellationToken ct = default);

    Task<OrderEntity?> GetForUpdateAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<OrderEntity>> GetByClientVehicleIdForUpdateAsync(int vehicleId, CancellationToken ct = default);

    void Add(OrderEntity order);

    Task<bool> ExistsAsync(int id, CancellationToken ct = default);

    Task<OrderWorkEntity?> GetWorkForUpdateAsync(int orderId, int workId, CancellationToken ct = default);

    Task<OrderPartEntity?> GetPartForUpdateAsync(int orderId, int partId, CancellationToken ct = default);

    void Remove(OrderEntity order);

    void AddPhoto(OrderPhotoEntity photo);

    Task<OrderPhotoEntity?> GetPhotoForUpdateAsync(int orderId, int photoId, CancellationToken ct = default);

    void RemovePhoto(OrderPhotoEntity photo);

    void AddWork(OrderWorkEntity work);

    void AddPart(OrderPartEntity part);

    void RemoveWork(OrderWorkEntity work);

    void RemovePart(OrderPartEntity part);
}
