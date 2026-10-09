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
        var rows = await reminders.GetAllWithCarAsync(ct);

        // Нагадування без авто пропускаємо — так само, як flatMap на клієнті.
        return [.. rows.Where(x => x.Car is not null).Select(x => x.ToModel().ToDto(today))];
    }
}
