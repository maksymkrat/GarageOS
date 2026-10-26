namespace GarageOS.Domain.Models;

public sealed class Subscription
{
    public int Id { get; init; }

    public required string Name { get; set; }

    public decimal Price { get; set; }

    public int PeriodMonths { get; set; }
}
