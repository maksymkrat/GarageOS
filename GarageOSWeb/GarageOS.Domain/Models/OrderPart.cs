using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

public sealed class OrderPart
{
    public int Id { get; init; }
    public int OrderId { get; init; }

    public required string Description { get; set; }

    public decimal Buy { get; set; }

    public decimal Sell { get; set; }

    public PaymentStatus PaymentStatus { get; set; }
}
