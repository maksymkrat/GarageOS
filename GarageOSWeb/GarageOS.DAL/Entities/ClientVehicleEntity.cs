using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class ClientVehicleEntity : BaseEntity
{
    public int ClientId { get; set; }
    public ClientEntity Client { get; set; } = null!;

    public required string Plate { get; set; }
    public required string Kind { get; set; }
    public required string Make { get; set; }
    public required string Model { get; set; }
    public int? Year { get; set; }
    public ClientVehicleStatus Status { get; set; }
    public int? Mileage { get; set; }
    public MileageUnit MileageUnit { get; set; }
    public DateOnly LastVisit { get; set; }
    public DateOnly? NextService { get; set; }

    public Guid? PhotoId { get; set; }

    public ICollection<OrderEntity> Orders { get; set; } = [];
}
