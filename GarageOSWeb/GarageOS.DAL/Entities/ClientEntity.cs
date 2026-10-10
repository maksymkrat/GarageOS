namespace GarageOS.DAL.Entities;

public class ClientEntity : BaseEntity
{
    public required string Name { get; set; }

    /// <summary>Десять цифр. Унікальний: саме за номером авто знаходять власника.</summary>
    public required string Phone { get; set; }

    public int? UserId { get; set; }
    public UserEntity? User { get; set; }

    public ICollection<CarEntity> Cars { get; set; } = [];
}
