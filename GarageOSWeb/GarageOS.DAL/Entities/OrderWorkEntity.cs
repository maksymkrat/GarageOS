using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class OrderWorkEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public required string Description { get; set; }
    public decimal Price { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
}
