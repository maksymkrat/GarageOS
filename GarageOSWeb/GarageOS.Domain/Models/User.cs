namespace GarageOS.Domain.Models;

public sealed class User
{
    public int Id { get; init; }

    public required long TelegramId { get; init; }

    public required string Phone { get; set; }

    public required string FirstName { get; set; }

    public string? LastName { get; set; }

    public int? SubscriptionId { get; set; }
}
