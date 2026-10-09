namespace GarageOS.DAL.Entities;

public class OrderWorkEntity : AuditableEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
}
