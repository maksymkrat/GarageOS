using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class CarEntity : AuditableEntity
{
    public int ClientId { get; set; }
    public ClientEntity Client { get; set; } = null!;

    public string Plate { get; set; } = null!;
    public string Make { get; set; } = null!;
    public string Model { get; set; } = null!;
    public int Year { get; set; }
    public CarStatus Status { get; set; }
    public decimal Debt { get; set; }
    public int Mileage { get; set; }
    public DateOnly LastVisit { get; set; }
    public DateOnly? NextService { get; set; }

    public ICollection<OrderEntity> Orders { get; set; } = [];
    public ICollection<ReminderEntity> Reminders { get; set; } = [];
}
