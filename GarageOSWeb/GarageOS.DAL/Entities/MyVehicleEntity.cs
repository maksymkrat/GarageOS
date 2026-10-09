namespace GarageOS.DAL.Entities;

public class MyVehicleEntity : AuditableEntity
{
    public int UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string Kind { get; set; } = null!;
    public string Name { get; set; } = null!;
    public int Year { get; set; }
    public int Mileage { get; set; }
    public string Unit { get; set; } = null!;

    /// <summary>Вільний текст, не дата.</summary>
    public string? Due { get; set; }

    public ICollection<LogEntryEntity> Log { get; set; } = [];
}
