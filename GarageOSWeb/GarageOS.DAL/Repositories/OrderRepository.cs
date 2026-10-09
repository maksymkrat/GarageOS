using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class OrderRepository(GarageDbContext db) : IOrderRepository
{
    public async Task<IReadOnlyList<OrderEntity>> GetAllAsync(CancellationToken ct = default) =>
        await WithLines().OrderByDescending(x => x.Id).ToListAsync(ct);

    public Task<OrderEntity?> GetByIdAsync(int id, CancellationToken ct = default) =>
        WithLines().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<OrderEntity>> GetByCarIdAsync(int carId, CancellationToken ct = default) =>
        await WithLines().Where(x => x.CarId == carId).OrderByDescending(x => x.Id).ToListAsync(ct);

    public void Add(OrderEntity order) => db.Orders.Add(order);

    /// <summary>
    /// Split query: два Include-колекції в одному запиті дали б декартів добуток
    /// рядків робіт на запчастини.
    /// </summary>
    private IQueryable<OrderEntity> WithLines() =>
        db.Orders
            .AsNoTracking()
            .AsSplitQuery()
            .Include(x => x.Works)
            .Include(x => x.Parts);
}
