using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class ReminderConfiguration : IEntityTypeConfiguration<ReminderEntity>
{
    public void Configure(EntityTypeBuilder<ReminderEntity> builder)
    {
        builder.ToTable("reminders");
        builder.Property(x => x.Message).HasMaxLength(300).IsRequired();

        builder.HasOne(x => x.ClientVehicle)
            .WithMany(x => x.Reminders)
            .HasForeignKey(x => x.ClientVehicleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
