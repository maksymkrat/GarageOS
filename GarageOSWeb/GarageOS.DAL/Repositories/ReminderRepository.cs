using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class ReminderRepository(GarageDbContext db) : IReminderRepository
{
    public async Task<IReadOnlyList<ReminderEntity>> GetAllWithCarAsync(CancellationToken ct = default) =>
        await db.Reminders
            .AsNoTracking()
            .Include(x => x.Car).ThenInclude(x => x.Client)
            .OrderBy(x => x.DueDate ?? DateOnly.MaxValue)
            .ToListAsync(ct);
}
