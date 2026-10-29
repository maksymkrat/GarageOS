using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class MyVehicleRepository(GarageDbContext db) : IMyVehicleRepository
{
    public async Task<IReadOnlyList<MyVehicleEntity>> GetAllAsync(
        int userId,
        bool includeLog,
        CancellationToken ct = default) =>
        await Query(includeLog)
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Id)
            .ToListAsync(ct);

    public Task<MyVehicleEntity?> GetByIdAsync(
        int userId,
        int id,
        bool includeLog,
        CancellationToken ct = default) =>
        Query(includeLog).FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

    public void Add(MyVehicleEntity vehicle) => db.MyVehicles.Add(vehicle);

    public void AddLogEntry(LogEntryEntity entry) => db.LogEntries.Add(entry);

    public Task<MyVehicleEntity?> GetForUpdateAsync(
        int userId,
        int id,
        CancellationToken ct = default) =>
        db.MyVehicles.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId, ct);

    public Task<LogEntryEntity?> GetLogEntryForUpdateAsync(
        int userId,
        int vehicleId,
        int entryId,
        CancellationToken ct = default) =>
        db.LogEntries.FirstOrDefaultAsync(
            x => x.Id == entryId && x.VehicleId == vehicleId && x.Vehicle.UserId == userId,
            ct);

    public void Remove(MyVehicleEntity vehicle) => db.MyVehicles.Remove(vehicle);

    public void RemoveLogEntry(LogEntryEntity entry) => db.LogEntries.Remove(entry);

    private IQueryable<MyVehicleEntity> Query(bool includeLog)
    {
        var vehicles = db.MyVehicles.AsNoTracking();

        return includeLog
            ? vehicles.Include(x => x.Log.OrderByDescending(entry => entry.CreatedAt))
            : vehicles;
    }
}
