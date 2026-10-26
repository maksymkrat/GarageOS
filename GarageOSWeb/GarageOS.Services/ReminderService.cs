using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Mapping;

namespace GarageOS.Services;

public class ReminderService(IReminderRepository reminders, TimeProvider time) : IReminderService
{
    public async Task<IReadOnlyList<ReminderItemDto>> GetRemindersAsync(CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);
        var rows = await reminders.GetAllWithVehicleAsync(ct);

        return [.. rows.Where(x => x.ClientVehicle is not null).Select(x => x.ToModel().ToDto(today))];
    }
}
