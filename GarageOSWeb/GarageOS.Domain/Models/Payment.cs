namespace GarageOS.Domain.Models;

/// <summary>Оплата за нарядом. У контракті поки не з'являється — наряд несе лише суму Paid.</summary>
public sealed class Payment
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public DateOnly Date { get; init; }
    public decimal Amount { get; init; }
    public required string Method { get; init; }
}
