using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class MyVehicleEntity : BaseEntity
{
    public int UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public required string Kind { get; set; }
    public required string Name { get; set; }
    public int Year { get; set; }
    public int Mileage { get; set; }
    public MileageUnit MileageUnit { get; set; }

    public Guid? PhotoId { get; set; }

    public ICollection<LogEntryEntity> Log { get; set; } = [];
}
