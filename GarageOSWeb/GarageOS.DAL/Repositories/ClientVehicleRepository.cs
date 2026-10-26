using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class ClientVehicleRepository(GarageDbContext db) : IClientVehicleRepository
{
    public async Task<IReadOnlyList<ClientVehicleEntity>> GetAllAsync(CancellationToken ct = default) =>
        await db.ClientVehicles
            .AsNoTracking()
            .Include(x => x.Client)
            .OrderByDescending(x => x.Id)
            .ToListAsync(ct);

    public Task<ClientVehicleEntity?> GetByIdAsync(int id, CancellationToken ct = default) =>
        db.ClientVehicles
            .AsNoTracking()
            .Include(x => x.Client)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyDictionary<int, decimal>> GetDebtsAsync(CancellationToken ct = default)
    {
        var works = await db.OrderWorks
            .Where(x => x.PaymentStatus == PaymentStatus.Unpaid)
            .GroupBy(x => x.Order.ClientVehicleId)
            .Select(g => new { VehicleId = g.Key, Amount = g.Sum(x => x.Price) })
            .ToListAsync(ct);

        var parts = await db.OrderParts
            .Where(x => x.PaymentStatus == PaymentStatus.Unpaid)
            .GroupBy(x => x.Order.ClientVehicleId)
            .Select(g => new { VehicleId = g.Key, Amount = g.Sum(x => x.Sell) })
            .ToListAsync(ct);

        var debts = new Dictionary<int, decimal>();

        foreach (var row in works.Concat(parts))
        {
            debts[row.VehicleId] = debts.GetValueOrDefault(row.VehicleId) + row.Amount;
        }

        return debts;
    }

    public async Task<decimal> GetDebtAsync(int vehicleId, CancellationToken ct = default)
    {
        var works = await db.OrderWorks
            .Where(x => x.Order.ClientVehicleId == vehicleId && x.PaymentStatus == PaymentStatus.Unpaid)
            .SumAsync(x => (decimal?)x.Price, ct) ?? 0m;

        var parts = await db.OrderParts
            .Where(x => x.Order.ClientVehicleId == vehicleId && x.PaymentStatus == PaymentStatus.Unpaid)
            .SumAsync(x => (decimal?)x.Sell, ct) ?? 0m;

        return works + parts;
    }

    public async Task<IReadOnlyList<ClientVehicleDebt>> GetDebtorsAsync(CancellationToken ct = default)
    {
        var debts = await GetDebtsAsync(ct);

        var owing = debts.Where(x => x.Value > 0)
            .OrderByDescending(x => x.Value)
            .ToList();

        if (owing.Count == 0) return [];

        var ids = owing.Select(x => x.Key).ToList();

        var vehicles = await db.ClientVehicles
            .AsNoTracking()
            .Include(x => x.Client)
            .Where(x => ids.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, ct);

        return [.. owing.Where(x => vehicles.ContainsKey(x.Key))
            .Select(x => new ClientVehicleDebt(vehicles[x.Key], x.Value))];
    }

    public Task<int> CountSiblingsAsync(int clientId, int exceptVehicleId, CancellationToken ct = default) =>
        db.ClientVehicles.CountAsync(x => x.ClientId == clientId && x.Id != exceptVehicleId, ct);

    public Task<ClientVehicleEntity?> GetForUpdateAsync(int id, CancellationToken ct = default) =>
        db.ClientVehicles.Include(x => x.Client).FirstOrDefaultAsync(x => x.Id == id, ct);

    public void Add(ClientVehicleEntity vehicle) => db.ClientVehicles.Add(vehicle);
}
