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

    // Id of the current photo, null when there is none. Only the id: the path
    // is built in one place in code, because paths in a table rot the first
    // time the folders are reorganised (ADR-0026).
    public Guid? PhotoId { get; set; }

    public ICollection<OrderEntity> Orders { get; set; } = [];
}
