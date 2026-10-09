using System.Globalization;
using GarageOS.Domain.Enums;

namespace GarageOS.Services.Mapping;

/// <summary>
/// Межа між типами домену й формами, яких чекає клієнт. У БД дати — <c>date</c>,
/// статуси — рядки enum; контракт хоче «22.04.2026» і 'in_work'. Формат дати
/// повторює todayLabel() з GarageOSMobile/src/lib/format.ts.
/// </summary>
public static class ContractFormat
{
    private const string DatePattern = "dd.MM.yyyy";

    public static string Date(DateOnly value) =>
        value.ToString(DatePattern, CultureInfo.InvariantCulture);

    public static string? Date(DateOnly? value) => value is { } date ? Date(date) : null;

    public static string Status(CarStatus status) => status switch
    {
        CarStatus.InWork => "in_work",
        CarStatus.WaitingPart => "waiting_part",
        CarStatus.Ready => "ready",
        CarStatus.HasDebt => "has_debt",
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
    };

    public static string Kind(LogEntryKind kind) => kind switch
    {
        LogEntryKind.Oil => "oil",
        LogEntryKind.Brakes => "brakes",
        LogEntryKind.Tires => "tires",
        LogEntryKind.Filter => "filter",
        LogEntryKind.Other => "other",
        _ => throw new ArgumentOutOfRangeException(nameof(kind), kind, null)
    };

    public static FinancePeriod ParsePeriod(string? value) => value?.ToLowerInvariant() switch
    {
        "week" => FinancePeriod.Week,
        "month" => FinancePeriod.Month,
        "year" => FinancePeriod.Year,
        _ => throw new ArgumentException($"Невідомий період: {value}", nameof(value))
    };

    /// <summary>
    /// Десять цифр, як на клієнті: <c>input.phone.replace(/\D/g, '').slice(-10)</c>.
    /// </summary>
    public static string Phone(string raw)
    {
        var digits = new string([.. raw.Where(char.IsDigit)]);
        return digits.Length <= 10 ? digits : digits[^10..];
    }
}
