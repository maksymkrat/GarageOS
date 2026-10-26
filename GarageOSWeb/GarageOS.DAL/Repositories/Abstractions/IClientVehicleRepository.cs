using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public sealed record ClientVehicleDebt(ClientVehicleEntity Vehicle, decimal Debt);

public interface IClientVehicleRepository
{
    Task<IReadOnlyList<ClientVehicleEntity>> GetAllAsync(CancellationToken ct = default);

    Task<ClientVehicleEntity?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<ClientVehicleDebt>> GetDebtorsAsync(CancellationToken ct = default);

    Task<IReadOnlyDictionary<int, decimal>> GetDebtsAsync(CancellationToken ct = default);

    Task<decimal> GetDebtAsync(int vehicleId, CancellationToken ct = default);

    Task<int> CountSiblingsAsync(int clientId, int exceptVehicleId, CancellationToken ct = default);

    // Tracked and with the client loaded: the caller changes the row and
    // then maps it back, and the owner's name travels in that DTO.
    Task<ClientVehicleEntity?> GetForUpdateAsync(int id, CancellationToken ct = default);

    void Add(ClientVehicleEntity vehicle);
}
