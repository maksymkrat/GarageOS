using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class ReminderRepository(GarageDbContext db) : IReminderRepository
{
    public async Task<IReadOnlyList<ReminderEntity>> GetAllWithVehicleAsync(CancellationToken ct = default) =>
        await db.Reminders
            .AsNoTracking()
            .Include(x => x.ClientVehicle).ThenInclude(x => x.Client)
            .OrderBy(x => x.DueDate ?? DateOnly.MaxValue)
            .ToListAsync(ct);
}
