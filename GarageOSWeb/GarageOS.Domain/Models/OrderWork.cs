namespace GarageOS.Domain.Models;

/// <summary>Робота в наряді. У контракті — елемент вкладеного масиву без власного id.</summary>
public sealed class OrderWork
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public required string Name { get; init; }
    public decimal Price { get; init; }
}
