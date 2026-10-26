using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IReminderRepository
{
    Task<IReadOnlyList<ReminderEntity>> GetAllWithVehicleAsync(CancellationToken ct = default);
}
