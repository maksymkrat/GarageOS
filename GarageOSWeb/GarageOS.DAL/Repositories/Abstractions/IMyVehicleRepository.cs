using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IMyVehicleRepository
{
    Task<IReadOnlyList<MyVehicleEntity>> GetAllAsync(
        int userId,
        bool includeLog,
        CancellationToken ct = default);

    Task<MyVehicleEntity?> GetByIdAsync(
        int userId,
        int id,
        bool includeLog,
        CancellationToken ct = default);

    // Tracked, unlike the reads above: what comes back is going to be
    // changed or removed, and AsNoTracking would make the change invisible
    // to SaveChanges.
    Task<MyVehicleEntity?> GetForUpdateAsync(int userId, int id, CancellationToken ct = default);

    Task<LogEntryEntity?> GetLogEntryForUpdateAsync(
        int userId,
        int vehicleId,
        int entryId,
        CancellationToken ct = default);

    void Add(MyVehicleEntity vehicle);

    void AddLogEntry(LogEntryEntity entry);

    void Remove(MyVehicleEntity vehicle);

    void RemoveLogEntry(LogEntryEntity entry);
}
