namespace GarageOS.DAL.Entities;

public class OrderPhotoEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public Guid PhotoId { get; set; }
}
