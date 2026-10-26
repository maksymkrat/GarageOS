using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

public sealed class OrderWork
{
    public int Id { get; init; }
    public int OrderId { get; init; }

    public required string Description { get; set; }

    public decimal Price { get; set; }

    public PaymentStatus PaymentStatus { get; set; }
}
