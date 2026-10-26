using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class OrderRepository(GarageDbContext db) : IOrderRepository
{
    public async Task<IReadOnlyList<OrderEntity>> GetAllAsync(
        bool includeLines,
        CancellationToken ct = default) =>
        await (includeLines ? WithLines() : db.Orders.AsNoTracking())
            .OrderByDescending(x => x.Id)
            .ToListAsync(ct);

    public Task<OrderEntity?> GetByIdAsync(int id, CancellationToken ct = default) =>
        WithPhotos().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<OrderEntity>> GetByClientVehicleIdAsync(
        int vehicleId,
        CancellationToken ct = default) =>
        await WithLines()
            .Where(x => x.ClientVehicleId == vehicleId)
            .OrderByDescending(x => x.Id)
            .ToListAsync(ct);

    public Task<OrderEntity?> GetForUpdateAsync(int id, CancellationToken ct = default) =>
        db.Orders
            .AsSplitQuery()
            .Include(x => x.Works)
            .Include(x => x.Parts)
            .FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<OrderEntity>> GetByClientVehicleIdForUpdateAsync(
        int vehicleId,
        CancellationToken ct = default) =>
        await db.Orders
            .AsSplitQuery()
            .Include(x => x.Works)
            .Include(x => x.Parts)
            .Where(x => x.ClientVehicleId == vehicleId)
            .OrderByDescending(x => x.Id)
            .ToListAsync(ct);

    public void Add(OrderEntity order) => db.Orders.Add(order);

    public Task<bool> ExistsAsync(int id, CancellationToken ct = default) =>
        db.Orders.AnyAsync(x => x.Id == id, ct);

    public Task<OrderWorkEntity?> GetWorkForUpdateAsync(
        int orderId,
        int workId,
        CancellationToken ct = default) =>
        db.OrderWorks.FirstOrDefaultAsync(x => x.Id == workId && x.OrderId == orderId, ct);

    public Task<OrderPartEntity?> GetPartForUpdateAsync(
        int orderId,
        int partId,
        CancellationToken ct = default) =>
        db.OrderParts.FirstOrDefaultAsync(x => x.Id == partId && x.OrderId == orderId, ct);

    public void Remove(OrderEntity order) => db.Orders.Remove(order);

    public void AddPhoto(OrderPhotoEntity photo) => db.OrderPhotos.Add(photo);

    public Task<OrderPhotoEntity?> GetPhotoForUpdateAsync(
        int orderId,
        int photoId,
        CancellationToken ct = default) =>
        db.OrderPhotos.FirstOrDefaultAsync(x => x.Id == photoId && x.OrderId == orderId, ct);

    public void RemovePhoto(OrderPhotoEntity photo) => db.OrderPhotos.Remove(photo);

    public void AddWork(OrderWorkEntity work) => db.OrderWorks.Add(work);

    public void AddPart(OrderPartEntity part) => db.OrderParts.Add(part);

    public void RemoveWork(OrderWorkEntity work) => db.OrderWorks.Remove(work);

    public void RemovePart(OrderPartEntity part) => db.OrderParts.Remove(part);

    private IQueryable<OrderEntity> WithLines() =>
        db.Orders
            .AsNoTracking()
            .AsSplitQuery()
            .Include(x => x.Works)
            .Include(x => x.Parts);

    // Photos come with the single-order read only: the list screens do not show
    // them, so GetAllAsync stays as light as it was (ADR-0027).
    private IQueryable<OrderEntity> WithPhotos() =>
        WithLines().Include(x => x.Photos);
}
