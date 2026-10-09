namespace GarageOS.DAL.Repositories.Abstractions;

/// <summary>Агрегати рахує БД, не застосунок: інакше в пам'ять їдуть усі наряди.</summary>
public interface IFinanceRepository
{
    Task<FinanceTotals> GetTotalsAsync(DateOnly from, DateOnly to, CancellationToken ct = default);
}

/// <param name="Works">Сума робіт за період.</param>
/// <param name="PartsMargin">Маржа на запчастинах: (sell − buy) × qty.</param>
/// <param name="Visits">Кількість нарядів за період.</param>
public readonly record struct FinanceTotals(decimal Works, decimal PartsMargin, int Visits);
