using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Mapping;

namespace GarageOS.Services;

public class FinanceService(
    IFinanceRepository finance,
    IClientVehicleRepository vehicles,
    TimeProvider time) : IFinanceService
{
    public async Task<FinanceOverviewDto> GetOverviewAsync(string period, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);
        var from = StartOf(ContractFormat.ParsePeriod(period), today);

        var totals = await finance.GetTotalsAsync(
            ContractFormat.StartOfDayUtc(from),
            ContractFormat.StartOfDayUtc(today.AddDays(1)),
            ct);

        var debtors = await vehicles.GetDebtorsAsync(ct);

        var stats = new FinanceStatsDto(
            Earned: totals.Works + totals.PartsMargin,
            Works: totals.Works,
            Parts: totals.PartsMargin,
            Visits: totals.Visits);

        return new FinanceOverviewDto(
            stats,
            [.. debtors.Select(x => x.Vehicle.ToModel().ToDto(x.Debt))],
            debtors.Sum(x => x.Debt));
    }

    private static DateOnly StartOf(FinancePeriod period, DateOnly today) => period switch
    {
        FinancePeriod.Week => today.AddDays(-6),
        FinancePeriod.Month => today.AddMonths(-1).AddDays(1),
        FinancePeriod.Year => today.AddYears(-1).AddDays(1),
        _ => throw new ArgumentOutOfRangeException(nameof(period), period, null)
    };
}
