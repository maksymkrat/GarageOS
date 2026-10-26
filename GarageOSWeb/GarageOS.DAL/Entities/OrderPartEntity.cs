using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class OrderPartEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public required string Description { get; set; }

    public decimal Buy { get; set; }

    public decimal Sell { get; set; }

    public PaymentStatus PaymentStatus { get; set; }
}
