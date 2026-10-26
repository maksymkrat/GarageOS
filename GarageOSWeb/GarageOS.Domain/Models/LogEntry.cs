using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

public sealed class LogEntry
{
    public int Id { get; init; }
    public int VehicleId { get; init; }

    public DateTime CreatedAt { get; init; }

    public required string Note { get; set; }
    public decimal Cost { get; set; }
    public LogEntryKind Kind { get; set; }

    public int? Mileage { get; set; }
    public MileageUnit MileageUnit { get; set; }
}
