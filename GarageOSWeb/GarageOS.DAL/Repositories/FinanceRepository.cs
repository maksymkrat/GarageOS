using GarageOS.DAL.Context;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class FinanceRepository(GarageDbContext db) : IFinanceRepository
{
    public async Task<FinanceTotals> GetTotalsAsync(
        DateTime fromUtc,
        DateTime toUtc,
        CancellationToken ct = default)
    {
        var orders = db.Orders.Where(x => x.CreatedAt >= fromUtc && x.CreatedAt < toUtc);

        var works = await orders
            .SelectMany(x => x.Works)
            .Where(x => x.PaymentStatus == PaymentStatus.Paid)
            .SumAsync(x => (decimal?)x.Price, ct) ?? 0m;

        var partsMargin = await orders
            .SelectMany(x => x.Parts)
            .Where(x => x.PaymentStatus == PaymentStatus.Paid)
            .SumAsync(x => (decimal?)(x.Sell - x.Buy), ct) ?? 0m;

        var visits = await orders.CountAsync(ct);

        return new FinanceTotals(works, partsMargin, visits);
    }
}
