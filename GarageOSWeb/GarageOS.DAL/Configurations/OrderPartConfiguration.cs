using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class OrderPartConfiguration : IEntityTypeConfiguration<OrderPartEntity>
{
    public void Configure(EntityTypeBuilder<OrderPartEntity> builder)
    {
        builder.ToTable("order_parts");
        builder.Property(x => x.Description).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Buy).HasPrecision(10, 2);
        builder.Property(x => x.Sell).HasPrecision(10, 2);
        builder.Property(x => x.PaymentStatus).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.HasOne(x => x.Order)
            .WithMany(x => x.Parts)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
