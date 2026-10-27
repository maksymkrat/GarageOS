using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

public sealed class ClientVehicle
{
    public int Id { get; init; }
    public int ClientId { get; init; }

    public required string Plate { get; set; }

    // Free text, the same three values as MyVehicle.Kind (ADR-0029).
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

    public Client? Client { get; init; }
}
