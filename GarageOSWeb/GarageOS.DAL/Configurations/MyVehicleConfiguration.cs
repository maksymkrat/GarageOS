using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class MyVehicleConfiguration : IEntityTypeConfiguration<MyVehicleEntity>
{
    public void Configure(EntityTypeBuilder<MyVehicleEntity> builder)
    {
        builder.ToTable("my_vehicles");
        builder.Property(x => x.Kind).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.MileageUnit).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.HasIndex(x => x.UserId);

        builder.HasOne(x => x.User)
            .WithMany(x => x.Vehicles)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
