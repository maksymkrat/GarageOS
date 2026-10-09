using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

/// <summary>Запис у журналі ТО одиниці техніки з особистого гаража.</summary>
public sealed class LogEntry
{
    public int Id { get; init; }
    public int VehicleId { get; init; }
    public DateOnly Date { get; init; }
    public int Mileage { get; init; }
    public required string Title { get; init; }
    public string? Note { get; init; }
    public decimal Cost { get; init; }
    public LogEntryKind Kind { get; init; }
}
