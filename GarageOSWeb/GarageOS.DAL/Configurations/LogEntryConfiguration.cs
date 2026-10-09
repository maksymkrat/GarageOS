using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class LogEntryConfiguration : IEntityTypeConfiguration<LogEntryEntity>
{
    public void Configure(EntityTypeBuilder<LogEntryEntity> builder)
    {
        builder.ToTable("log_entries");
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Note).HasMaxLength(1000);
        builder.Property(x => x.Cost).HasPrecision(10, 2);
        builder.Property(x => x.Kind).HasConversion<string>().HasMaxLength(32).IsRequired();

        builder.HasOne(x => x.Vehicle)
            .WithMany(x => x.Log)
            .HasForeignKey(x => x.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
