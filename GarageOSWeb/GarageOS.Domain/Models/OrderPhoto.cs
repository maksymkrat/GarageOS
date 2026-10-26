namespace GarageOS.Domain.Models;

public sealed class OrderPhoto
{
    public int Id { get; init; }
    public int OrderId { get; init; }

    public Guid PhotoId { get; init; }
}
