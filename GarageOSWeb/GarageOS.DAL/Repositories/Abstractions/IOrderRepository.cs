using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IOrderRepository
{
    Task<IReadOnlyList<OrderEntity>> GetAllAsync(CancellationToken ct = default);

    Task<OrderEntity?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<OrderEntity>> GetByCarIdAsync(int carId, CancellationToken ct = default);

    void Add(OrderEntity order);
}
