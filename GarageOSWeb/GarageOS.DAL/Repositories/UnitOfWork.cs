using GarageOS.DAL.Context;
using GarageOS.DAL.Repositories.Abstractions;

namespace GarageOS.DAL.Repositories;

public class UnitOfWork(GarageDbContext db) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct = default) => db.SaveChangesAsync(ct);
}
