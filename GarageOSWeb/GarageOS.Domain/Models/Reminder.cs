namespace GarageOS.Domain.Models;

/// <summary>Нагадування про ТО. <c>Overdue</c> не зберігається — рахується зі строку.</summary>
public sealed class Reminder
{
    public int Id { get; init; }
    public int CarId { get; init; }
    public DateOnly? DueDate { get; init; }
    public int? DueMileage { get; init; }
    public required string Message { get; init; }

    public Car? Car { get; init; }

    /// <summary>Прострочено за датою або за пробігом авто, залежно від того, що задано.</summary>
    public bool IsOverdue(DateOnly today) =>
        (DueDate is { } due && due < today) ||
        (DueMileage is { } mileage && Car is { } car && car.Mileage >= mileage);
}
