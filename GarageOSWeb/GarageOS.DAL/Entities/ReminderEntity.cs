namespace GarageOS.DAL.Entities;

public class ReminderEntity : BaseEntity
{
    public int CarId { get; set; }
    public CarEntity Car { get; set; } = null!;

    public DateOnly? DueDate { get; set; }
    public int? DueMileage { get; set; }

    /// <summary>Текст, який контракт віддає як <c>what</c>.</summary>
    public required string Message { get; set; }
}
