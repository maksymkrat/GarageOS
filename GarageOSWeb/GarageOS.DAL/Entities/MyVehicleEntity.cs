namespace GarageOS.DAL.Entities;

public class MyVehicleEntity : BaseEntity
{
    public int UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public required string Kind { get; set; }
    public required string Name { get; set; }
    public int Year { get; set; }
    public int Mileage { get; set; }
    public required string Unit { get; set; }

    /// <summary>Вільний текст, не дата.</summary>
    public string? Due { get; set; }

    public ICollection<LogEntryEntity> Log { get; set; } = [];
}
