namespace GarageOS.DAL.Repositories.Abstractions;

/// <summary>
/// Одна транзакція на операцію. Потрібен тому, що створення авто може зачіпати
/// три таблиці — клієнта, авто й наряд — і вони мусять лягти разом або ніяк.
/// </summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
