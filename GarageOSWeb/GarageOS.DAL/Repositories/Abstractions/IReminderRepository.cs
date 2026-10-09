using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IReminderRepository
{
    /// <summary>Разом з авто: контракт віддає номер, власника й телефон у тому ж об'єкті.</summary>
    Task<IReadOnlyList<ReminderEntity>> GetAllWithCarAsync(CancellationToken ct = default);
}
