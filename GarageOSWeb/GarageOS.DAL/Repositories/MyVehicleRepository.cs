using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class MyVehicleRepository(GarageDbContext db) : IMyVehicleRepository
{
    public async Task<IReadOnlyList<MyVehicleEntity>> GetAllAsync(CancellationToken ct = default) =>
        await WithLog().OrderBy(x => x.Id).ToListAsync(ct);

    public Task<MyVehicleEntity?> GetByIdAsync(int id, CancellationToken ct = default) =>
        WithLog().FirstOrDefaultAsync(x => x.Id == id, ct);

    private IQueryable<MyVehicleEntity> WithLog() =>
        db.MyVehicles
            .AsNoTracking()
            .Include(x => x.Log.OrderByDescending(entry => entry.Date));
}
