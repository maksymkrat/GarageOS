namespace GarageOS.Domain.Models;

/// <summary>Запчастина в наряді: ціна купівлі й продажу зберігаються окремо.</summary>
public sealed class OrderPart
{
    public int Id { get; init; }
    public int OrderId { get; init; }
    public required string Name { get; init; }
    public int Qty { get; init; }
    public decimal Buy { get; init; }
    public decimal Sell { get; init; }
}
