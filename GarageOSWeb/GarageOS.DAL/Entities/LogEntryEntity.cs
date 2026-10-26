using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class LogEntryEntity : BaseEntity
{
    public int VehicleId { get; set; }
    public MyVehicleEntity Vehicle { get; set; } = null!;

    public required string Note { get; set; }
    public decimal Cost { get; set; }
    public LogEntryKind Kind { get; set; }

    public int? Mileage { get; set; }
    public MileageUnit MileageUnit { get; set; }
}
