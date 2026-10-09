using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IMyVehicleRepository
{
    Task<IReadOnlyList<MyVehicleEntity>> GetAllAsync(CancellationToken ct = default);

    Task<MyVehicleEntity?> GetByIdAsync(int id, CancellationToken ct = default);
}
