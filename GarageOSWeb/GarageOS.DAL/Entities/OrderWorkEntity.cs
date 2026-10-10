namespace GarageOS.DAL.Entities;

public class OrderWorkEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public required string Name { get; set; }
    public decimal Price { get; set; }
}
