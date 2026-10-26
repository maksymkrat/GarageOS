namespace GarageOS.Domain.Models;

public sealed class Client
{
    public int Id { get; init; }

    public required string Name { get; set; }

    public required string Phone { get; set; }

    public int? UserId { get; set; }
}
