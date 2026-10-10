namespace GarageOS.DAL.Entities;

public class ClientEntity : BaseEntity
{
    public string Name { get; set; } = null!;

    /// <summary>Десять цифр. Унікальний: саме за номером авто знаходять власника.</summary>
    public string Phone { get; set; } = null!;

    public int? UserId { get; set; }
    public UserEntity? User { get; set; }

    public ICollection<CarEntity> Cars { get; set; } = [];
}
