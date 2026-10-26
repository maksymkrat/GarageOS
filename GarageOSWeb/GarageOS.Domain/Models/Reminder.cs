namespace GarageOS.Domain.Models;

public sealed class Reminder
{
    public int Id { get; init; }
    public int ClientVehicleId { get; init; }

    public DateOnly? DueDate { get; set; }

    public int? DueMileage { get; set; }

    public required string Message { get; set; }

    public ClientVehicle? ClientVehicle { get; init; }

    public bool IsOverdue(DateOnly today) =>
        (DueDate is { } due && due < today) ||
        (DueMileage is { } dueMileage
            && ClientVehicle is { Mileage: { } actual }
            && actual >= dueMileage);
}
