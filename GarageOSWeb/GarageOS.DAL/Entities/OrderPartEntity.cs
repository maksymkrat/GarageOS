namespace GarageOS.DAL.Entities;

public class OrderPartEntity : BaseEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public string Name { get; set; } = null!;
    public int Qty { get; set; }

    /// <summary>Закупівельна ціна — у контракті віддається, бо екран рахує маржу.</summary>
    public decimal Buy { get; set; }

    public decimal Sell { get; set; }
}
