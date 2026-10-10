namespace GarageOS.DAL.Entities;

public class SubscriptionEntity : BaseEntity
{
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public int PeriodMonths { get; set; }

    public ICollection<UserEntity> Users { get; set; } = [];
}
