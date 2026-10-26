using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

public sealed class MyVehicle
{
    public int Id { get; init; }

    public int UserId { get; init; }

    public required string Kind { get; set; }
    public required string Name { get; set; }
    public int Year { get; set; }
    public int Mileage { get; set; }

    public MileageUnit MileageUnit { get; set; }

    public Guid? PhotoId { get; set; }

    public IReadOnlyList<LogEntry> Log { get; set; } = [];
}
