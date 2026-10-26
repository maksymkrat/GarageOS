namespace GarageOS.DAL.Entities;

public class ReminderEntity : BaseEntity
{
    public int ClientVehicleId { get; set; }
    public ClientVehicleEntity ClientVehicle { get; set; } = null!;

    public DateOnly? DueDate { get; set; }
    public int? DueMileage { get; set; }

    public required string Message { get; set; }
}
