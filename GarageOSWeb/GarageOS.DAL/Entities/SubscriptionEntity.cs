namespace GarageOS.DAL.Entities;

public class SubscriptionEntity : BaseEntity
{
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int PeriodMonths { get; set; }

    public ICollection<UserEntity> Users { get; set; } = [];
}
