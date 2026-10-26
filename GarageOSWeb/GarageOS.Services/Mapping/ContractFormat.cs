using System.Globalization;
using GarageOS.Domain.Enums;
using GarageOS.Services.Exceptions;

namespace GarageOS.Services.Mapping;

public static class ContractFormat
{
    private const string DatePattern = "dd.MM.yyyy";

    public static string Date(DateOnly value) =>
        value.ToString(DatePattern, CultureInfo.InvariantCulture);

    public static string? Date(DateOnly? value) => value is { } date ? Date(date) : null;

    public static string Date(DateTime instant) => Date(LocalDate(instant));

    public static int DaysWaiting(DateTime createdAt, DateOnly today) =>
        Math.Max(0, today.DayNumber - LocalDate(createdAt).DayNumber);

    public static DateTime StartOfDayUtc(DateOnly date) =>
        DateTime.SpecifyKind(date.ToDateTime(TimeOnly.MinValue), DateTimeKind.Local).ToUniversalTime();

    public static string Status(ClientVehicleStatus status) => status switch
    {
        ClientVehicleStatus.InWork => "in_work",
        ClientVehicleStatus.WaitingPart => "waiting_part",
        ClientVehicleStatus.Ready => "ready",
        ClientVehicleStatus.HasDebt => "has_debt",
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
    };

    public static ClientVehicleStatus ParseStatus(string? value) => value?.Trim().ToLowerInvariant() switch
    {
        "in_work" => ClientVehicleStatus.InWork,
        "waiting_part" => ClientVehicleStatus.WaitingPart,
        "ready" => ClientVehicleStatus.Ready,
        "has_debt" => ClientVehicleStatus.HasDebt,
        _ => throw new ArgumentException($"Невідомий стан авто: {value}", nameof(value))
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

    public static LogEntryKind ParseKind(string? value) => value?.Trim().ToLowerInvariant() switch
    {
        "oil" => LogEntryKind.Oil,
        "brakes" => LogEntryKind.Brakes,
        "tires" => LogEntryKind.Tires,
        "filter" => LogEntryKind.Filter,
        "other" => LogEntryKind.Other,
        _ => throw new ArgumentException($"Невідомий тип запису: {value}", nameof(value))
    };

    public static string Unit(MileageUnit unit) => unit switch
    {
        MileageUnit.Kilometers => "km",
        MileageUnit.Hours => "hours",
        _ => throw new ArgumentOutOfRangeException(nameof(unit), unit, null)
    };

    public static MileageUnit ParseUnit(string? value) => value?.Trim().ToLowerInvariant() switch
    {
        null or "" => MileageUnit.Kilometers,
        "km" => MileageUnit.Kilometers,
        "hours" => MileageUnit.Hours,
        _ => throw new ArgumentException($"Невідома одиниця пробігу: {value}", nameof(value))
    };

    public static string Payment(PaymentStatus status) => status switch
    {
        PaymentStatus.Unpaid => "unpaid",
        PaymentStatus.Paid => "paid",
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
    };

    public static PaymentStatus ParsePayment(string? value) => value?.Trim().ToLowerInvariant() switch
    {
        "unpaid" => PaymentStatus.Unpaid,
        "paid" => PaymentStatus.Paid,
        _ => throw new ArgumentException($"Невідомий стан оплати: {value}", nameof(value))
    };

    public static PhotoSize ParsePhotoSize(string? value) => value?.Trim().ToLowerInvariant() switch
    {
        null or "" or "full" => PhotoSize.Full,
        "thumb" => PhotoSize.Thumb,
        _ => throw new BadRequestException($"Невідомий розмір фото: {value}")
    };

    public static FinancePeriod ParsePeriod(string? value) => value?.ToLowerInvariant() switch
    {
        "week" => FinancePeriod.Week,
        "month" => FinancePeriod.Month,
        "year" => FinancePeriod.Year,
        _ => throw new ArgumentException($"Невідомий період: {value}", nameof(value))
    };

    public static string Phone(string raw)
    {
        var digits = new string([.. raw.Where(char.IsDigit)]);
        return digits.Length <= 10 ? digits : digits[^10..];
    }

    private static DateOnly LocalDate(DateTime instant) =>
        DateOnly.FromDateTime(DateTime.SpecifyKind(instant, DateTimeKind.Utc).ToLocalTime());
}
