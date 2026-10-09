using GarageOS.DAL.Entities;
using GarageOS.Domain.Models;

namespace GarageOS.Services.Mapping;

/// <summary>Перший з двох мапінгів: EF-сутність у доменну модель.</summary>
public static class EntityMapper
{
    public static Client ToModel(this ClientEntity e) =>
        new() { Id = e.Id, Name = e.Name, Phone = e.Phone, UserId = e.UserId };

    public static Car ToModel(this CarEntity e) => new()
    {
        Id = e.Id,
        ClientId = e.ClientId,
        Plate = e.Plate,
        Make = e.Make,
        Model = e.Model,
        Year = e.Year,
        Status = e.Status,
        Debt = e.Debt,
        Mileage = e.Mileage,
        LastVisit = e.LastVisit,
        NextService = e.NextService,
        Client = e.Client?.ToModel()
    };

    public static OrderWork ToModel(this OrderWorkEntity e) =>
        new() { Id = e.Id, OrderId = e.OrderId, Name = e.Name, Price = e.Price };

    public static OrderPart ToModel(this OrderPartEntity e) =>
        new() { Id = e.Id, OrderId = e.OrderId, Name = e.Name, Qty = e.Qty, Buy = e.Buy, Sell = e.Sell };

    public static Order ToModel(this OrderEntity e) => new()
    {
        Id = e.Id,
        CarId = e.CarId,
        Date = e.Date,
        Description = e.Description,
        Status = e.Status,
        Paid = e.Paid,
        DaysWaiting = e.DaysWaiting,
        Works = [.. e.Works.Select(ToModel)],
        Parts = [.. e.Parts.Select(ToModel)]
    };

    public static Reminder ToModel(this ReminderEntity e) => new()
    {
        Id = e.Id,
        CarId = e.CarId,
        DueDate = e.DueDate,
        DueMileage = e.DueMileage,
        Message = e.Message,
        Car = e.Car?.ToModel()
    };

    public static LogEntry ToModel(this LogEntryEntity e) => new()
    {
        Id = e.Id,
        VehicleId = e.VehicleId,
        Date = e.Date,
        Mileage = e.Mileage,
        Title = e.Title,
        Note = e.Note,
        Cost = e.Cost,
        Kind = e.Kind
    };

    public static MyVehicle ToModel(this MyVehicleEntity e) => new()
    {
        Id = e.Id,
        UserId = e.UserId,
        Kind = e.Kind,
        Name = e.Name,
        Year = e.Year,
        Mileage = e.Mileage,
        Unit = e.Unit,
        Due = e.Due,
        Log = [.. e.Log.Select(ToModel)]
    };

    public static User ToModel(this UserEntity e) => new()
    {
        Id = e.Id,
        FirebaseUid = e.FirebaseUid,
        Email = e.Email,
        Name = e.Name,
        Phone = e.Phone,
        SubscriptionId = e.SubscriptionId
    };
}
