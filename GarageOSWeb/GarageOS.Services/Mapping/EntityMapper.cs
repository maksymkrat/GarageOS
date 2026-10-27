using GarageOS.DAL.Entities;
using GarageOS.Domain.Models;

namespace GarageOS.Services.Mapping;

public static class EntityMapper
{
    public static Client ToModel(this ClientEntity e) =>
        new() { Id = e.Id, Name = e.Name, Phone = e.Phone, UserId = e.UserId };

    public static ClientVehicle ToModel(this ClientVehicleEntity e) => new()
    {
        Id = e.Id,
        ClientId = e.ClientId,
        Plate = e.Plate,
        Kind = e.Kind,
        Make = e.Make,
        Model = e.Model,
        Year = e.Year,
        Status = e.Status,
        Mileage = e.Mileage,
        MileageUnit = e.MileageUnit,
        LastVisit = e.LastVisit,
        NextService = e.NextService,
        PhotoId = e.PhotoId,
        Client = e.Client?.ToModel()
    };

    public static OrderPhoto ToModel(this OrderPhotoEntity e) => new()
    {
        Id = e.Id,
        OrderId = e.OrderId,
        PhotoId = e.PhotoId
    };

    public static OrderWork ToModel(this OrderWorkEntity e) => new()
    {
        Id = e.Id,
        OrderId = e.OrderId,
        Description = e.Description,
        Price = e.Price,
        PaymentStatus = e.PaymentStatus
    };

    public static OrderPart ToModel(this OrderPartEntity e) => new()
    {
        Id = e.Id,
        OrderId = e.OrderId,
        Description = e.Description,
        Buy = e.Buy,
        Sell = e.Sell,
        PaymentStatus = e.PaymentStatus
    };

    public static Order ToModel(this OrderEntity e) => new()
    {
        Id = e.Id,
        ClientVehicleId = e.ClientVehicleId,
        CreatedAt = e.CreatedAt,
        Description = e.Description,
        Works = [.. e.Works.Select(ToModel)],
        Parts = [.. e.Parts.Select(ToModel)]
    };

    public static Reminder ToModel(this ReminderEntity e) => new()
    {
        Id = e.Id,
        ClientVehicleId = e.ClientVehicleId,
        DueDate = e.DueDate,
        DueMileage = e.DueMileage,
        Message = e.Message,
        ClientVehicle = e.ClientVehicle?.ToModel()
    };

    public static LogEntry ToModel(this LogEntryEntity e) => new()
    {
        Id = e.Id,
        VehicleId = e.VehicleId,
        CreatedAt = e.CreatedAt,
        Note = e.Note,
        Cost = e.Cost,
        Kind = e.Kind,
        Mileage = e.Mileage,
        MileageUnit = e.MileageUnit
    };

    public static MyVehicle ToModel(this MyVehicleEntity e) => new()
    {
        Id = e.Id,
        UserId = e.UserId,
        Kind = e.Kind,
        Name = e.Name,
        Year = e.Year,
        Mileage = e.Mileage,
        MileageUnit = e.MileageUnit,
        PhotoId = e.PhotoId,
        Log = [.. e.Log.Select(ToModel)]
    };

    public static User ToModel(this UserEntity e) => new()
    {
        Id = e.Id,
        TelegramId = e.TelegramId,
        FirstName = e.FirstName,
        LastName = e.LastName,
        Phone = e.Phone,
        SubscriptionId = e.SubscriptionId
    };
}
