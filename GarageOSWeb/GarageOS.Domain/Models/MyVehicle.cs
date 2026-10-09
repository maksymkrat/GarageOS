namespace GarageOS.Domain.Models;

/// <summary>Одиниця техніки в особистому гаражі: авто, мотоцикл чи будь-що обслуговуване.</summary>
public sealed class MyVehicle
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public required string Kind { get; init; }
    public required string Name { get; init; }
    public int Year { get; init; }
    public int Mileage { get; init; }

    /// <summary>Одиниця пробігу: «км» для авто, «мотогод» для техніки.</summary>
    public required string Unit { get; init; }

    /// <summary>Вільний текст найближчого обслуговування, не дата: «Заміна масла через 600 км».</summary>
    public string? Due { get; init; }

    public IReadOnlyList<LogEntry> Log { get; init; } = [];
}
