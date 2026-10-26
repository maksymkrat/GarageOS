using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class OrderWorkConfiguration : IEntityTypeConfiguration<OrderWorkEntity>
{
    public void Configure(EntityTypeBuilder<OrderWorkEntity> builder)
    {
        builder.ToTable("order_works");
        builder.Property(x => x.Description).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Price).HasPrecision(10, 2);
        builder.Property(x => x.PaymentStatus).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.HasOne(x => x.Order)
            .WithMany(x => x.Works)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
