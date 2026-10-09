using GarageOS.Domain.Models;
using GarageOS.Services.Dtos;

namespace GarageOS.Services.Mapping;

/// <summary>
/// Другий мапінг: доменна модель у форму контракту. Саме тут нормалізована БД
/// знову стає плоскою — власник і телефон приїжджають у сам об'єкт авто, а
/// роботи й запчастини вкладаються в наряд.
/// </summary>
public static class DtoMapper
{
    public static CarDto ToDto(this Car car) => new(
        car.Id,
        car.Plate,
        car.Make,
        car.Model,
        car.Year,
        car.Client?.Name ?? string.Empty,
        car.Client?.Phone ?? string.Empty,
        ContractFormat.Status(car.Status),
        car.Debt,
        car.Mileage,
        ContractFormat.Date(car.LastVisit),
        ContractFormat.Date(car.NextService));

    public static OrderDto ToDto(this Order order) => new(
        order.Id,
        order.CarId,
        ContractFormat.Date(order.Date),
        order.Description,
        [.. order.Works.Select(w => new OrderWorkDto(w.Name, w.Price))],
        [.. order.Parts.Select(p => new OrderPartDto(p.Name, p.Qty, p.Buy, p.Sell))],
        ContractFormat.Status(order.Status),
        order.Paid,
        order.DaysWaiting);

    public static LogEntryDto ToDto(this LogEntry entry) => new(
        entry.Id,
        ContractFormat.Date(entry.Date),
        entry.Mileage,
        entry.Title,
        entry.Note,
        entry.Cost,
        ContractFormat.Kind(entry.Kind));

    public static MyVehicleDto ToDto(this MyVehicle vehicle) => new(
        vehicle.Id,
        vehicle.Kind,
        vehicle.Name,
        vehicle.Year,
        vehicle.Mileage,
        vehicle.Unit,
        vehicle.Due,
        [.. vehicle.Log.Select(ToDto)]);

    public static ReminderItemDto ToDto(this Reminder reminder, DateOnly today) => new(
        reminder.Id,
        reminder.CarId,
        reminder.Car?.Plate ?? string.Empty,
        reminder.Car?.Client?.Name ?? string.Empty,
        reminder.Car?.Client?.Phone ?? string.Empty,
        reminder.Message,
        reminder.IsOverdue(today));
}
