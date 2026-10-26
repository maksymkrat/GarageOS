namespace GarageOS.DAL.Repositories.Abstractions;

public interface IFinanceRepository
{
    Task<FinanceTotals> GetTotalsAsync(DateTime fromUtc, DateTime toUtc, CancellationToken ct = default);
}

public readonly record struct FinanceTotals(decimal Works, decimal PartsMargin, int Visits);
