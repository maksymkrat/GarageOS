using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<OrderEntity>
{
    public void Configure(EntityTypeBuilder<OrderEntity> builder)
    {
        builder.ToTable("orders");
        builder.Property(x => x.Description).HasMaxLength(1000).IsRequired();

        builder.HasIndex(x => x.ClientVehicleId);
        builder.HasIndex(x => x.CreatedAt);

        builder.HasOne(x => x.ClientVehicle)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.ClientVehicleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
