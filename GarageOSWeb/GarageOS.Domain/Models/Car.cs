using GarageOS.Domain.Enums;

namespace GarageOS.Domain.Models;

/// <summary>Авто на обслуговуванні. Власник живе окремо — у <see cref="Client"/>.</summary>
public sealed class Car
{
    public int Id { get; init; }
    public int ClientId { get; init; }
    public required string Plate { get; init; }
    public required string Make { get; init; }
    public required string Model { get; init; }
    public int Year { get; init; }
    public CarStatus Status { get; init; }
    public decimal Debt { get; init; }
    public int Mileage { get; init; }
    public DateOnly LastVisit { get; init; }
    public DateOnly? NextService { get; init; }

    /// <summary>Потрібен, щоб скласти плоскі owner/phone, яких чекає контракт.</summary>
    public Client? Client { get; init; }
}
