using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class ClientVehicleConfiguration : IEntityTypeConfiguration<ClientVehicleEntity>
{
    public void Configure(EntityTypeBuilder<ClientVehicleEntity> builder)
    {
        builder.ToTable("client_vehicles");
        builder.Property(x => x.Plate).HasMaxLength(16).IsRequired();
        builder.Property(x => x.Make).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Model).HasMaxLength(100).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>().HasMaxLength(32).IsRequired();
        builder.Property(x => x.MileageUnit).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.HasIndex(x => x.Plate);

        builder.HasOne(x => x.Client)
            .WithMany(x => x.Vehicles)
            .HasForeignKey(x => x.ClientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
