using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class OrderPhotoConfiguration : IEntityTypeConfiguration<OrderPhotoEntity>
{
    public void Configure(EntityTypeBuilder<OrderPhotoEntity> builder)
    {
        builder.ToTable("order_photos");

        builder.HasOne(x => x.Order)
            .WithMany(x => x.Photos)
            .HasForeignKey(x => x.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
