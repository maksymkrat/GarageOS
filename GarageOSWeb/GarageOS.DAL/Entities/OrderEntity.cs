namespace GarageOS.DAL.Entities;

public class OrderEntity : BaseEntity
{
    public int ClientVehicleId { get; set; }
    public ClientVehicleEntity ClientVehicle { get; set; } = null!;

    public required string Description { get; set; }

    public ICollection<OrderWorkEntity> Works { get; set; } = [];
    public ICollection<OrderPartEntity> Parts { get; set; } = [];
    public ICollection<OrderPhotoEntity> Photos { get; set; } = [];
}
