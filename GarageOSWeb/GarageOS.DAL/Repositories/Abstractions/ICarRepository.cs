using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface ICarRepository
{
    Task<IReadOnlyList<CarEntity>> GetAllAsync(CancellationToken ct = default);

    Task<CarEntity?> GetByIdAsync(int id, CancellationToken ct = default);

    /// <summary>Авто з боргом, від найбільшого — для зведення фінансів.</summary>
    Task<IReadOnlyList<CarEntity>> GetDebtorsAsync(CancellationToken ct = default);

    /// <summary>Скільки ще авто в того самого клієнта. Контракт зве це sameOwnerCount.</summary>
    Task<int> CountSiblingsAsync(int clientId, int exceptCarId, CancellationToken ct = default);

    void Add(CarEntity car);
}
