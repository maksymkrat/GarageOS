using GarageOS.DAL.Context;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class FinanceRepository(GarageDbContext db) : IFinanceRepository
{
    public async Task<FinanceTotals> GetTotalsAsync(DateOnly from, DateOnly to, CancellationToken ct = default)
    {
        var orders = db.Orders.Where(x => x.Date >= from && x.Date <= to);

        var works = await orders.SelectMany(x => x.Works).SumAsync(x => (decimal?)x.Price, ct) ?? 0m;

        var partsMargin = await orders.SelectMany(x => x.Parts)
            .SumAsync(x => (decimal?)((x.Sell - x.Buy) * x.Qty), ct) ?? 0m;

        var visits = await orders.CountAsync(ct);

        return new FinanceTotals(works, partsMargin, visits);
    }
}
