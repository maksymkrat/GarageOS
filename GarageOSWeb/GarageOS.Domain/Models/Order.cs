using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

/// <summary>Наряд на авто. Роботи й запчастини нормалізовані, контракт їх вкладає.</summary>
public sealed class Order
{
    public int Id { get; init; }
    public int CarId { get; init; }
    public DateOnly Date { get; init; }
    public required string Description { get; init; }
    public CarStatus Status { get; init; }
    public decimal Paid { get; init; }
    public int DaysWaiting { get; init; }

    public IReadOnlyList<OrderWork> Works { get; init; } = [];
    public IReadOnlyList<OrderPart> Parts { get; init; } = [];
}
