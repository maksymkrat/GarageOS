namespace GarageOS.Domain.Models;

public sealed class Order
{
    public int Id { get; init; }
    public int ClientVehicleId { get; init; }

    public DateTime CreatedAt { get; init; }

    public required string Description { get; set; }

    public IReadOnlyList<OrderWork> Works { get; set; } = [];

    public IReadOnlyList<OrderPart> Parts { get; set; } = [];
}
