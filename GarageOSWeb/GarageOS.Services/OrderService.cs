using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;
using GarageOS.Services.Photos;

namespace GarageOS.Services;

public class OrderService(
    IOrderRepository orders,
    IClientVehicleRepository vehicles,
    IPhotoStorage photos,
    IUnitOfWork uow,
    TimeProvider time) : IOrderService
{
    private const string OrderNotFound = "Наряд не знайдено";
    private const string WorkNotFound = "Роботу не знайдено";
    private const string PartNotFound = "Деталь не знайдено";
    private const string PhotoNotFound = "Фото не знайдено";

    public async Task<IReadOnlyList<OrderDto>> GetOrdersAsync(
        bool includeLines,
        CancellationToken ct = default)
    {
        var today = Today();
        var rows = await orders.GetAllAsync(includeLines, ct);

        return [.. rows.Select(x => x.ToModel().ToDto(today))];
    }

    public async Task<OrderDetailDto> GetOrderDetailAsync(int id, CancellationToken ct = default)
    {
        var today = Today();

        var order = await orders.GetByIdAsync(id, ct)
                    ?? throw new NotFoundException(OrderNotFound);

        var vehicle = await vehicles.GetByIdAsync(order.ClientVehicleId, ct)
                      ?? throw new NotFoundException("Авто наряду не знайдено");

        var debt = await vehicles.GetDebtAsync(order.ClientVehicleId, ct);

        return new OrderDetailDto(
            order.ToModel().ToDto(today),
            vehicle.ToModel().ToDto(debt),
            [.. order.Photos.OrderBy(x => x.Id).Select(x => x.ToModel().ToDto())]);
    }

    public async Task<OrderDto> CreateOrderAsync(
        CreateOrderRequest request,
        CancellationToken ct = default)
    {
        var today = Today();

        var vehicle = await vehicles.GetByIdAsync(request.ClientVehicleId, ct)
            ?? throw new NotFoundException("Авто не знайдено");

        var order = new OrderEntity
        {
            ClientVehicleId = request.ClientVehicleId,
            Description = request.Description.Trim()
        };

        foreach (var work in request.Works) order.Works.Add(NewWork(work));
        foreach (var part in request.Parts) order.Parts.Add(NewPart(part));

        orders.Add(order);

        vehicle.Status = ClientVehicleStatus.InWork;

        await uow.SaveChangesAsync(ct);

        return order.ToModel().ToDto(today);
    }

    public async Task<OrderDto> UpdateOrderAsync(
        int id,
        UpdateOrderRequest request,
        CancellationToken ct = default)
    {
        var today = Today();

        var order = await orders.GetForUpdateAsync(id, ct)
                    ?? throw new NotFoundException(OrderNotFound);

        order.Description = request.Description.Trim();

        await uow.SaveChangesAsync(ct);

        return order.ToModel().ToDto(today);
    }

    public async Task DeleteOrderAsync(int id, CancellationToken ct = default)
    {
        var order = await orders.GetForUpdateAsync(id, ct)
                    ?? throw new NotFoundException(OrderNotFound);

        orders.Remove(order);

        await uow.SaveChangesAsync(ct);

        photos.DeleteAll(PhotoOwner.Order, id);
    }

    public async Task<OrderDetailDto> PayOrderAsync(int id, CancellationToken ct = default)
    {
        var today = Today();

        var order = await orders.GetForUpdateAsync(id, ct)
                    ?? throw new NotFoundException(OrderNotFound);

        var vehicle = await vehicles.GetForUpdateAsync(order.ClientVehicleId, ct)
                      ?? throw new NotFoundException("Авто наряду не знайдено");

        OrderPayment.Settle([order], vehicle);

        await uow.SaveChangesAsync(ct);

        var debt = await vehicles.GetDebtAsync(order.ClientVehicleId, ct);

        return new OrderDetailDto(
            order.ToModel().ToDto(today),
            vehicle.ToModel().ToDto(debt),
            [.. order.Photos.OrderBy(x => x.Id).Select(x => x.ToModel().ToDto())]);
    }

    public async Task<OrderWorkDto> AddWorkAsync(
        int orderId,
        OrderWorkRequest request,
        CancellationToken ct = default)
    {
        await RequireOrderAsync(orderId, ct);

        var work = NewWork(request);
        work.OrderId = orderId;

        orders.AddWork(work);

        await uow.SaveChangesAsync(ct);

        return work.ToModel().ToDto();
    }

    public async Task<OrderWorkDto> UpdateWorkAsync(
        int orderId,
        int workId,
        OrderWorkRequest request,
        CancellationToken ct = default)
    {
        var work = await orders.GetWorkForUpdateAsync(orderId, workId, ct)
                   ?? throw new NotFoundException(WorkNotFound);

        work.Description = request.Description.Trim();
        work.Price = request.Price;
        work.PaymentStatus = ContractFormat.ParsePayment(request.PaymentStatus);

        await uow.SaveChangesAsync(ct);

        return work.ToModel().ToDto();
    }

    public async Task DeleteWorkAsync(int orderId, int workId, CancellationToken ct = default)
    {
        var work = await orders.GetWorkForUpdateAsync(orderId, workId, ct)
                   ?? throw new NotFoundException(WorkNotFound);

        orders.RemoveWork(work);

        await uow.SaveChangesAsync(ct);
    }

    public async Task<OrderPartDto> AddPartAsync(
        int orderId,
        OrderPartRequest request,
        CancellationToken ct = default)
    {
        await RequireOrderAsync(orderId, ct);

        var part = NewPart(request);
        part.OrderId = orderId;

        orders.AddPart(part);

        await uow.SaveChangesAsync(ct);

        return part.ToModel().ToDto();
    }

    public async Task<OrderPartDto> UpdatePartAsync(
        int orderId,
        int partId,
        OrderPartRequest request,
        CancellationToken ct = default)
    {
        var part = await orders.GetPartForUpdateAsync(orderId, partId, ct)
                   ?? throw new NotFoundException(PartNotFound);

        part.Description = request.Description.Trim();
        part.Buy = request.Buy;
        part.Sell = request.Sell;
        part.PaymentStatus = ContractFormat.ParsePayment(request.PaymentStatus);

        await uow.SaveChangesAsync(ct);

        return part.ToModel().ToDto();
    }

    public async Task DeletePartAsync(int orderId, int partId, CancellationToken ct = default)
    {
        var part = await orders.GetPartForUpdateAsync(orderId, partId, ct)
                   ?? throw new NotFoundException(PartNotFound);

        orders.RemovePart(part);

        await uow.SaveChangesAsync(ct);
    }

    public async Task<OrderPhotoDto> AddPhotoAsync(
        int orderId,
        Stream upload,
        CancellationToken ct = default)
    {
        await RequireOrderAsync(orderId, ct);

        var photoId = Guid.CreateVersion7();
        var processed = PhotoProcessor.Process(upload);

        await photos.SaveAsync(
            PhotoOwner.Order,
            orderId,
            photoId,
            processed.Full,
            processed.Thumb,
            ct);

        var photo = new OrderPhotoEntity { OrderId = orderId, PhotoId = photoId };

        orders.AddPhoto(photo);

        await uow.SaveChangesAsync(ct);

        return photo.ToModel().ToDto();
    }

    public async Task DeletePhotoAsync(int orderId, int photoId, CancellationToken ct = default)
    {
        var photo = await orders.GetPhotoForUpdateAsync(orderId, photoId, ct)
                    ?? throw new NotFoundException(PhotoNotFound);

        var file = photo.PhotoId;

        orders.RemovePhoto(photo);

        await uow.SaveChangesAsync(ct);

        photos.Delete(PhotoOwner.Order, orderId, file);
    }

    public async Task<StoredPhoto> GetPhotoAsync(
        int orderId,
        int photoId,
        PhotoSize size,
        CancellationToken ct = default)
    {
        var photo = await orders.GetPhotoForUpdateAsync(orderId, photoId, ct)
                    ?? throw new NotFoundException(PhotoNotFound);

        return photos.Open(PhotoOwner.Order, orderId, photo.PhotoId, size)
               ?? throw new NotFoundException(PhotoNotFound);
    }

    private async Task RequireOrderAsync(int orderId, CancellationToken ct)
    {
        if (!await orders.ExistsAsync(orderId, ct))
        {
            throw new NotFoundException(OrderNotFound);
        }
    }

    private DateOnly Today() => DateOnly.FromDateTime(time.GetLocalNow().DateTime);

    private static OrderWorkEntity NewWork(OrderWorkRequest request) => new()
    {
        Description = request.Description.Trim(),
        Price = request.Price,
        PaymentStatus = ContractFormat.ParsePayment(request.PaymentStatus)
    };

    private static OrderPartEntity NewPart(OrderPartRequest request) => new()
    {
        Description = request.Description.Trim(),
        Buy = request.Buy,
        Sell = request.Sell,
        PaymentStatus = ContractFormat.ParsePayment(request.PaymentStatus)
    };
}
