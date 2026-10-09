namespace GarageOS.DAL.Entities;

public class PaymentEntity : AuditableEntity
{
    public int OrderId { get; set; }
    public OrderEntity Order { get; set; } = null!;

    public DateOnly Date { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = null!;
}
