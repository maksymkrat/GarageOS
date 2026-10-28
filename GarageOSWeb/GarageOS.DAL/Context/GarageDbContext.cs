using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Context;

public class GarageDbContext(DbContextOptions<GarageDbContext> options) : DbContext(options)
{
    public DbSet<ClientEntity> Clients => Set<ClientEntity>();
    public DbSet<ClientVehicleEntity> ClientVehicles => Set<ClientVehicleEntity>();
    public DbSet<OrderEntity> Orders => Set<OrderEntity>();
    public DbSet<OrderWorkEntity> OrderWorks => Set<OrderWorkEntity>();
    public DbSet<OrderPartEntity> OrderParts => Set<OrderPartEntity>();
    public DbSet<OrderPhotoEntity> OrderPhotos => Set<OrderPhotoEntity>();
    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<SubscriptionEntity> Subscriptions => Set<SubscriptionEntity>();
    public DbSet<MyVehicleEntity> MyVehicles => Set<MyVehicleEntity>();
    public DbSet<LogEntryEntity> LogEntries => Set<LogEntryEntity>();
    public DbSet<LoginCodeEntity> LoginCodes => Set<LoginCodeEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GarageDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
        StampAudit();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken ct = default)
    {
        StampAudit();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, ct);
    }

    private void StampAudit()
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Property(x => x.CreatedAt).IsModified = false;
                entry.Entity.UpdatedAt = now;
            }
        }
    }
}
