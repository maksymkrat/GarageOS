using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class CarEntity : BaseEntity
{
    public int ClientId { get; set; }
    public ClientEntity Client { get; set; } = null!;

    public required string Plate { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
    public int Year { get; set; }
    public CarStatus Status { get; set; }
    public decimal Debt { get; set; }
    public int Mileage { get; set; }
    public DateOnly LastVisit { get; set; }
    public DateOnly? NextService { get; set; }

    public ICollection<OrderEntity> Orders { get; set; } = [];
    public ICollection<ReminderEntity> Reminders { get; set; } = [];
}
