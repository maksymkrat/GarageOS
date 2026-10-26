namespace GarageOS.DAL.Entities;

public class UserEntity : BaseEntity
{
    public required long TelegramId { get; set; }

    public required string Phone { get; set; }

    public required string FirstName { get; set; }

    public string? LastName { get; set; }

    public string? RefreshTokenHash { get; set; }

    public DateTime? RefreshExpiresAt { get; set; }

    public int? SubscriptionId { get; set; }
    public SubscriptionEntity? Subscription { get; set; }

    public ICollection<MyVehicleEntity> Vehicles { get; set; } = [];
    public ICollection<LoginCodeEntity> LoginCodes { get; set; } = [];
}
