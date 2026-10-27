using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;
using GarageOS.Services.Photos;

namespace GarageOS.Services;

public class ClientVehicleService(
    IClientVehicleRepository vehicles,
    IClientRepository clients,
    IOrderRepository orders,
    IPhotoStorage photos,
    IUnitOfWork uow,
    TimeProvider time) : IClientVehicleService
{
    private const string NoDescription = "Без опису";
    private const string VehicleNotFound = "Авто не знайдено";
    private const string PhotoNotFound = "Фото не знайдено";

    public async Task<IReadOnlyList<ClientVehicleDto>> GetVehiclesAsync(CancellationToken ct = default)
    {
        var rows = await vehicles.GetAllAsync(ct);

        var debts = await vehicles.GetDebtsAsync(ct);

        return [.. rows.Select(x => x.ToModel().ToDto(debts.GetValueOrDefault(x.Id)))];
    }

    public async Task<ClientVehicleDetailDto> GetVehicleDetailAsync(int id, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);

        var vehicle = await vehicles.GetByIdAsync(id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var vehicleOrders = await orders.GetByClientVehicleIdAsync(id, ct);
        var siblings = await vehicles.CountSiblingsAsync(vehicle.ClientId, vehicle.Id, ct);
        var debt = await vehicles.GetDebtAsync(id, ct);

        return new ClientVehicleDetailDto(
            vehicle.ToModel().ToDto(debt),
            [.. vehicleOrders.Select(x => x.ToModel().ToDto(today))],
            siblings);
    }

    // The card's own button settles the whole debt, which may span more than
    // one order, so all of them go in a single transaction rather than one
    // request per order from the client.
    public async Task<ClientVehicleDetailDto> PayVehicleAsync(int id, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);

        var vehicle = await vehicles.GetForUpdateAsync(id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var vehicleOrders = await orders.GetByClientVehicleIdForUpdateAsync(id, ct);

        OrderPayment.Settle(vehicleOrders, vehicle);

        await uow.SaveChangesAsync(ct);

        var siblings = await vehicles.CountSiblingsAsync(vehicle.ClientId, vehicle.Id, ct);
        var debt = await vehicles.GetDebtAsync(id, ct);

        return new ClientVehicleDetailDto(
            vehicle.ToModel().ToDto(debt),
            [.. vehicleOrders.Select(x => x.ToModel().ToDto(today))],
            siblings);
    }

    // The file is written before the row, and the row before the old file is
    // unlinked. A file nobody points at is litter that can be swept; a row
    // pointing at a file that is gone is a broken picture on the screen
    // (ADR-0026).
    public async Task<ClientVehicleDto> SetPhotoAsync(
        int id,
        Stream upload,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var previous = vehicle.PhotoId;

        // Version 7 is time-ordered, so the folder lists in upload order.
        var photoId = Guid.CreateVersion7();

        var processed = PhotoProcessor.Process(upload);

        await photos.SaveAsync(
            PhotoOwner.ClientVehicle,
            id,
            photoId,
            processed.Full,
            processed.Thumb,
            ct);

        vehicle.PhotoId = photoId;

        await uow.SaveChangesAsync(ct);

        // A replacement never overwrites: the new picture got its own id, and
        // the old files go only once no row mentions them any more.
        if (previous is not null)
        {
            photos.Delete(PhotoOwner.ClientVehicle, id, previous.Value);
        }

        return vehicle.ToModel().ToDto(await vehicles.GetDebtAsync(id, ct));
    }

    public async Task<ClientVehicleDto> DeletePhotoAsync(int id, CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        var photoId = vehicle.PhotoId;

        if (photoId is not null)
        {
            vehicle.PhotoId = null;

            await uow.SaveChangesAsync(ct);

            photos.Delete(PhotoOwner.ClientVehicle, id, photoId.Value);
        }

        return vehicle.ToModel().ToDto(await vehicles.GetDebtAsync(id, ct));
    }

    public async Task<StoredPhoto> GetPhotoAsync(
        int id,
        Guid photoId,
        PhotoSize size,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetByIdAsync(id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        // The id in the path has to be this car's current photo. A stale or
        // guessed id reads as absent instead of as somebody else's picture.
        if (vehicle.PhotoId != photoId) throw new NotFoundException(PhotoNotFound);

        return photos.Open(PhotoOwner.ClientVehicle, id, photoId, size)
               ?? throw new NotFoundException(PhotoNotFound);
    }

    public async Task<ClientVehicleDto> UpdateStatusAsync(
        int id,
        UpdateClientVehicleStatusRequest request,
        CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetForUpdateAsync(id, ct)
                      ?? throw new NotFoundException(VehicleNotFound);

        vehicle.Status = ContractFormat.ParseStatus(request.Status);

        await uow.SaveChangesAsync(ct);

        // HasDebt is a state the master sets by hand; the money it refers to
        // is still counted from the unpaid lines (ADR-0011), so the debt is
        // read after the save rather than derived from the new status.
        var debt = await vehicles.GetDebtAsync(id, ct);

        return vehicle.ToModel().ToDto(debt);
    }

    public async Task<ClientVehicleDto> CreateVehicleAsync(
        CreateClientVehicleRequest request,
        CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);
        var phone = ContractFormat.Phone(request.Phone);

        var client = await clients.GetByPhoneAsync(phone, ct);
        if (client is null)
        {
            client = new ClientEntity { Name = request.Owner.Trim(), Phone = phone };
            clients.Add(client);
        }

        var vehicle = new ClientVehicleEntity
        {
            Client = client,
            Plate = request.Plate.Trim().ToUpperInvariant(),
            Kind = request.Kind.Trim(),
            Make = request.Make.Trim(),
            Model = request.Model.Trim(),
            Year = request.Year,
            Mileage = request.Mileage,
            MileageUnit = ContractFormat.ParseUnit(request.MileageUnit),
            Status = request.CreateOrder ? ClientVehicleStatus.InWork : ClientVehicleStatus.Ready,
            LastVisit = today
        };
        vehicles.Add(vehicle);

        if (request.CreateOrder)
        {
            orders.Add(new OrderEntity
            {
                ClientVehicle = vehicle,
                Description = string.IsNullOrWhiteSpace(request.Complaint)
                    ? NoDescription
                    : request.Complaint.Trim()
            });
        }

        await uow.SaveChangesAsync(ct);

        vehicle.Client = client;
        return vehicle.ToModel().ToDto(0m);
    }
}
