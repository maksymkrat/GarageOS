namespace GarageOS.DAL.Entities;

public class LoginCodeEntity : BaseEntity
{
    public int UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public required string CodeHash { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? ConsumedAt { get; set; }

    public int Attempts { get; set; }
}
