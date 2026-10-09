using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class LogEntryEntity : AuditableEntity
{
    public int VehicleId { get; set; }
    public MyVehicleEntity Vehicle { get; set; } = null!;

    public DateOnly Date { get; set; }
    public int Mileage { get; set; }
    public string Title { get; set; } = null!;
    public string? Note { get; set; }
    public decimal Cost { get; set; }
    public LogEntryKind Kind { get; set; }
}
