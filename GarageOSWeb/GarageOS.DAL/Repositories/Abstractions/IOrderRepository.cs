using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IOrderRepository
{
    Task<IReadOnlyList<OrderEntity>> GetAllAsync(bool includeLines, CancellationToken ct = default);

    Task<OrderEntity?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<OrderEntity>> GetByClientVehicleIdAsync(int vehicleId, CancellationToken ct = default);

    // Tracked and with lines loaded: the caller is going to replace that
    // collection or remove the order outright.
    Task<OrderEntity?> GetForUpdateAsync(int id, CancellationToken ct = default);

    // Every order of one car, tracked: settling the car's whole debt flips the
    // lines of all of them inside one transaction.
    Task<IReadOnlyList<OrderEntity>> GetByClientVehicleIdForUpdateAsync(int vehicleId, CancellationToken ct = default);

    void Add(OrderEntity order);

    Task<bool> ExistsAsync(int id, CancellationToken ct = default);

    // A line is reached through its order, so a line of another order reads as
    // absent rather than as someone else's row.
    Task<OrderWorkEntity?> GetWorkForUpdateAsync(int orderId, int workId, CancellationToken ct = default);

    Task<OrderPartEntity?> GetPartForUpdateAsync(int orderId, int partId, CancellationToken ct = default);

    void Remove(OrderEntity order);

    void AddPhoto(OrderPhotoEntity photo);

    // Reached through its order, like a line: a photo of another order reads as
    // absent rather than as someone else's row.
    Task<OrderPhotoEntity?> GetPhotoForUpdateAsync(int orderId, int photoId, CancellationToken ct = default);

    void RemovePhoto(OrderPhotoEntity photo);

    void AddWork(OrderWorkEntity work);

    void AddPart(OrderPartEntity part);

    void RemoveWork(OrderWorkEntity work);

    void RemovePart(OrderPartEntity part);
}
