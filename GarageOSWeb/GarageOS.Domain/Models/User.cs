namespace GarageOS.Domain.Models;

/// <summary>Акаунт. Паролі в Firebase; тут лише профіль, прив'язаний за UID (ADR-0005).</summary>
public sealed class User
{
    public int Id { get; init; }

    /// <summary>Claim <c>sub</c> з ID-токена. Унікальний, але не первинний ключ.</summary>
    public required string FirebaseUid { get; init; }

    /// <summary>Кеш із токена, не джерело істини — перезаписується при кожному вході.</summary>
    public required string Email { get; init; }

    public required string Name { get; init; }
    public string? Phone { get; init; }
    public int? SubscriptionId { get; init; }
}
