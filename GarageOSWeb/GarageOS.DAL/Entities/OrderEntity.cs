using GarageOS.Domain.Enums;

namespace GarageOS.DAL.Entities;

public class OrderEntity : BaseEntity
{
    public int CarId { get; set; }
    public CarEntity Car { get; set; } = null!;

    public DateOnly Date { get; set; }
    public required string Description { get; set; }
    public CarStatus Status { get; set; }
    public decimal Paid { get; set; }
    public int DaysWaiting { get; set; }

    public ICollection<OrderWorkEntity> Works { get; set; } = [];
    public ICollection<OrderPartEntity> Parts { get; set; } = [];
    public ICollection<PaymentEntity> Payments { get; set; } = [];
}
