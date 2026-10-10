namespace GarageOS.DAL.Entities;

public class UserEntity : BaseEntity
{
    /// <summary>Claim <c>sub</c> з ID-токена Firebase. Унікальний індекс, не PK (ADR-0005).</summary>
    public required string FirebaseUid { get; set; }

    public required string Email { get; set; }
    public required string Name { get; set; }
    public string? Phone { get; set; }

    public int? SubscriptionId { get; set; }
    public SubscriptionEntity? Subscription { get; set; }

    public ICollection<MyVehicleEntity> Vehicles { get; set; } = [];
}
