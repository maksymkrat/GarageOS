namespace GarageOS.Domain.Models;

/// <summary>План підписки. Один план — багато користувачів.</summary>
public sealed class Subscription
{
    public int Id { get; init; }
    public required string Name { get; init; }
    public decimal Price { get; init; }
    public int PeriodMonths { get; init; }
}
