namespace GarageOS.DAL.Entities;

public class ClientEntity : BaseEntity
{
    public required string Name { get; set; }

    public required string Phone { get; set; }

    public int? UserId { get; set; }
    public UserEntity? User { get; set; }

    public ICollection<ClientVehicleEntity> Vehicles { get; set; } = [];
}
