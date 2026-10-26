using GarageOS.Domain.Models;
using GarageOS.Services.Dtos;

namespace GarageOS.Services.Mapping;

public static class DtoMapper
{
    public static ClientVehicleDto ToDto(this ClientVehicle vehicle, decimal debt) => new(
        vehicle.Id,
        vehicle.Plate,
        vehicle.Make,
        vehicle.Model,
        vehicle.Year,
        vehicle.Client?.Name ?? string.Empty,
        vehicle.Client?.Phone ?? string.Empty,
        ContractFormat.Status(vehicle.Status),
        debt,
        vehicle.Mileage,
        ContractFormat.Unit(vehicle.MileageUnit),
        ContractFormat.Date(vehicle.LastVisit),
        ContractFormat.Date(vehicle.NextService),
        vehicle.PhotoId?.ToString("N"));

    public static OrderDto ToDto(this Order order, DateOnly today) => new(
        order.Id,
        order.ClientVehicleId,
        ContractFormat.Date(order.CreatedAt),
        order.Description,
        [.. order.Works.Select(ToDto)],
        [.. order.Parts.Select(ToDto)],
        ContractFormat.DaysWaiting(order.CreatedAt, today));

    public static OrderPhotoDto ToDto(this OrderPhoto photo) => new(photo.Id);

    public static OrderWorkDto ToDto(this OrderWork work) => new(
        work.Id,
        work.Description,
        work.Price,
        ContractFormat.Payment(work.PaymentStatus));

    public static OrderPartDto ToDto(this OrderPart part) => new(
        part.Id,
        part.Description,
        part.Buy,
        part.Sell,
        ContractFormat.Payment(part.PaymentStatus));

    public static LogEntryDto ToDto(this LogEntry entry) => new(
        entry.Id,
        ContractFormat.Date(entry.CreatedAt),
        entry.Note,
        entry.Cost,
        ContractFormat.Kind(entry.Kind),
        entry.Mileage,
        ContractFormat.Unit(entry.MileageUnit));

    public static MyVehicleDto ToDto(this MyVehicle vehicle) => new(
        vehicle.Id,
        vehicle.Kind,
        vehicle.Name,
        vehicle.Year,
        vehicle.Mileage,
        ContractFormat.Unit(vehicle.MileageUnit),
        [.. vehicle.Log.Select(ToDto)],
        vehicle.PhotoId?.ToString("N"));

    public static ReminderItemDto ToDto(this Reminder reminder, DateOnly today) => new(
        reminder.Id,
        reminder.ClientVehicleId,
        reminder.ClientVehicle?.Plate ?? string.Empty,
        reminder.ClientVehicle?.Client?.Name ?? string.Empty,
        reminder.ClientVehicle?.Client?.Phone ?? string.Empty,
        reminder.Message,
        reminder.IsOverdue(today));
}
