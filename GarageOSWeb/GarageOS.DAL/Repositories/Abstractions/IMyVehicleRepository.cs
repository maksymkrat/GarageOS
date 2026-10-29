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
