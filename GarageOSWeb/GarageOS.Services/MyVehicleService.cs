using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Domain.Enums;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;
using GarageOS.Services.Photos;

namespace GarageOS.Services;

public class MyVehicleService(
    IMyVehicleRepository vehicles,
    IPhotoStorage photos,
    IUnitOfWork uow) : IMyVehicleService
{
    private const string VehicleNotFound = "Техніку не знайдено";
    private const string PhotoNotFound = "Фото не знайдено";

    public async Task<IReadOnlyList<MyVehicleDto>> GetVehiclesAsync(
        int userId,
        bool includeLog,
        CancellationToken ct = default)
    {
        var rows = await vehicles.GetAllAsync(userId, includeLog, ct);
        return [.. rows.Select(x => x.ToModel().ToDto())];
    }

    public async Task<MyVehicleDto> GetVehicleAsync(
        int userId,
        int id,
        bool includeLog,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetByIdAsync(userId, id, includeLog, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        return vehicle.ToModel().ToDto();
    }

    public async Task<MyVehicleDto> CreateVehicleAsync(
        int userId,
        CreateMyVehicleRequest request,
        CancellationToken ct = default)
    {
        var vehicle = new MyVehicleEntity
        {
            UserId = userId,
            Kind = request.Kind.Trim(),
            Name = request.Name.Trim(),
            Year = request.Year,
            Mileage = request.Mileage,
            MileageUnit = ContractFormat.ParseUnit(request.MileageUnit)
        };

        vehicles.Add(vehicle);

        await uow.SaveChangesAsync(ct);

        return vehicle.ToModel().ToDto();
    }

    public async Task<MyVehicleDto> UpdateVehicleAsync(
        int userId,
        int id,
        UpdateMyVehicleRequest request,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(userId, id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        vehicle.Kind = request.Kind.Trim();
        vehicle.Name = request.Name.Trim();
        vehicle.Year = request.Year;
        vehicle.Mileage = request.Mileage;
        vehicle.MileageUnit = ContractFormat.ParseUnit(request.MileageUnit);

        await uow.SaveChangesAsync(ct);

        return vehicle.ToModel().ToDto();
    }

    public async Task DeleteVehicleAsync(int userId, int id, CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(userId, id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        // The whole log goes with it: log_entries cascades from my_vehicles.
        vehicles.Remove(vehicle);

        await uow.SaveChangesAsync(ct);

        // The row is gone, so nothing points at its photo any more.
        photos.DeleteAll(PhotoOwner.MyVehicle, id);
    }

    public async Task<LogEntryDto> AddLogEntryAsync(
        int userId,
        int vehicleId,
        CreateLogEntryRequest request,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetByIdAsync(userId, vehicleId, includeLog: false, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var entry = new LogEntryEntity
        {
            VehicleId = vehicle.Id,
            Note = request.Note.Trim(),
            Cost = request.Cost,
            Kind = ContractFormat.ParseKind(request.Kind),
            Mileage = request.Mileage,

            // Taken from the vehicle once, at the moment of service, and never
            // read from it again: the entry keeps its own unit so that changing
            // the vehicle's unit cannot rewrite history (ADR-0015).
            MileageUnit = vehicle.MileageUnit
        };

        vehicles.AddLogEntry(entry);

        await uow.SaveChangesAsync(ct);

        return entry.ToModel().ToDto();
    }

    public async Task<LogEntryDto> UpdateLogEntryAsync(
        int userId,
        int vehicleId,
        int entryId,
        UpdateLogEntryRequest request,
        CancellationToken ct = default)
    {
        var entry = await vehicles.GetLogEntryForUpdateAsync(userId, vehicleId, entryId, ct)
                    ?? throw new NotFoundException("Запис не знайдено");

        entry.Note = request.Note.Trim();
        entry.Cost = request.Cost;
        entry.Kind = ContractFormat.ParseKind(request.Kind);
        entry.Mileage = request.Mileage;

        // MileageUnit is deliberately absent from the request and left alone
        // here: an entry keeps the unit it was written in (ADR-0015). CreatedAt
        // is likewise untouched — GarageDbContext pins it on update, so the date
        // of the entry cannot be edited (ADR-0013).
        await uow.SaveChangesAsync(ct);

        return entry.ToModel().ToDto();
    }

    public async Task DeleteLogEntryAsync(
        int userId,
        int vehicleId,
        int entryId,
        CancellationToken ct = default)
    {
        var entry = await vehicles.GetLogEntryForUpdateAsync(userId, vehicleId, entryId, ct)
                    ?? throw new NotFoundException("Запис не знайдено");

        vehicles.RemoveLogEntry(entry);

        await uow.SaveChangesAsync(ct);
    }

    // The owner check is the repository's: GetForUpdateAsync takes userId, so
    // somebody else's vehicle reads as absent rather than as a 403 that would
    // confirm it exists. Write order is the same as for a customer's car —
    // file, row, then the old file (ADR-0026).
    public async Task<MyVehicleDto> SetPhotoAsync(
        int userId,
        int id,
        Stream upload,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(userId, id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var previous = vehicle.PhotoId;
        var photoId = Guid.CreateVersion7();

        var processed = PhotoProcessor.Process(upload);

        await photos.SaveAsync(
            PhotoOwner.MyVehicle,
            id,
            photoId,
            processed.Full,
            processed.Thumb,
            ct);

        vehicle.PhotoId = photoId;

        await uow.SaveChangesAsync(ct);

        if (previous is not null)
        {
            photos.Delete(PhotoOwner.MyVehicle, id, previous.Value);
        }

        return vehicle.ToModel().ToDto();
    }

    public async Task<MyVehicleDto> DeletePhotoAsync(
        int userId,
        int id,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(userId, id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var photoId = vehicle.PhotoId;

        if (photoId is not null)
        {
            vehicle.PhotoId = null;

            await uow.SaveChangesAsync(ct);

            photos.Delete(PhotoOwner.MyVehicle, id, photoId.Value);
        }

        return vehicle.ToModel().ToDto();
    }

    public async Task<StoredPhoto> GetPhotoAsync(
        int userId,
        int id,
        Guid photoId,
        PhotoSize size,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetByIdAsync(userId, id, includeLog: false, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        if (vehicle.PhotoId != photoId) throw new NotFoundException(PhotoNotFound);

        return photos.Open(PhotoOwner.MyVehicle, id, photoId, size)
               ?? throw new NotFoundException(PhotoNotFound);
    }
}
