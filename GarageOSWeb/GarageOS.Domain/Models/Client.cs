namespace GarageOS.Domain.Models;

/// <summary>Картка клієнта СТО. Існує без акаунта — її заводить майстер за номером.</summary>
public sealed class Client
{
    public int Id { get; init; }
    public required string Name { get; init; }

    /// <summary>Десять цифр без коду країни — так само, як у контракті клієнта.</summary>
    public required string Phone { get; init; }

    /// <summary>Заповнюється, коли та сама людина зареєструвала акаунт (ADR-0005).</summary>
    public int? UserId { get; init; }
}
