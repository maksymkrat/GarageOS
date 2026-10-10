namespace GarageOS.DAL.Entities;

public class OrderWorkEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
}
