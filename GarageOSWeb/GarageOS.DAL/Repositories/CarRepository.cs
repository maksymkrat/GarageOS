using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class CarRepository(GarageDbContext db) : ICarRepository
{
    public async Task<IReadOnlyList<CarEntity>> GetAllAsync(CancellationToken ct = default) =>
        await db.Cars
            .AsNoTracking()
            .Include(x => x.Client)
            .OrderByDescending(x => x.Id)
            .ToListAsync(ct);

    public Task<CarEntity?> GetByIdAsync(int id, CancellationToken ct = default) =>
        db.Cars
            .AsNoTracking()
            .Include(x => x.Client)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<CarEntity>> GetDebtorsAsync(CancellationToken ct = default) =>
        await db.Cars
            .AsNoTracking()
            .Include(x => x.Client)
            .Where(x => x.Debt > 0)
            .OrderByDescending(x => x.Debt)
            .ToListAsync(ct);

    public Task<int> CountSiblingsAsync(int clientId, int exceptCarId, CancellationToken ct = default) =>
        db.Cars.CountAsync(x => x.ClientId == clientId && x.Id != exceptCarId, ct);

    public void Add(CarEntity car) => db.Cars.Add(car);
}
