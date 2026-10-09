using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Mapping;

namespace GarageOS.Services;

public class FinanceService(
    IFinanceRepository finance,
    ICarRepository cars,
    TimeProvider time) : IFinanceService
{
    public async Task<FinanceOverviewDto> GetOverviewAsync(string period, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);
        var from = StartOf(ContractFormat.ParsePeriod(period), today);

        var totals = await finance.GetTotalsAsync(from, today, ct);
        var debtors = await cars.GetDebtorsAsync(ct);

        // «Заробили» = роботи плюс маржа на запчастинах. Закупівельна ціна в
        // контракті існує саме для цього; у моках число було статичним, тож
        // точна формула лишалася невизначеною — див. ADR-0006.
        var stats = new FinanceStatsDto(
            Earned: totals.Works + totals.PartsMargin,
            Works: totals.Works,
            Parts: totals.PartsMargin,
            Visits: totals.Visits);

        return new FinanceOverviewDto(
            stats,
            [.. debtors.Select(x => x.ToModel().ToDto())],
            debtors.Sum(x => x.Debt));
    }

    /// <summary>Вікна ковзні від сьогодні назад, не календарні.</summary>
    private static DateOnly StartOf(FinancePeriod period, DateOnly today) => period switch
    {
        FinancePeriod.Week => today.AddDays(-6),
        FinancePeriod.Month => today.AddMonths(-1).AddDays(1),
        FinancePeriod.Year => today.AddYears(-1).AddDays(1),
        _ => throw new ArgumentOutOfRangeException(nameof(period), period, null)
    };
}
