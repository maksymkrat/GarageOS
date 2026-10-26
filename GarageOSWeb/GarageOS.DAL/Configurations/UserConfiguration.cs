using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        builder.ToTable("users");
        builder.Property(x => x.Phone).HasMaxLength(10).IsRequired();
        builder.Property(x => x.FirstName).HasMaxLength(128).IsRequired();
        builder.Property(x => x.LastName).HasMaxLength(128);

        builder.Property(x => x.RefreshTokenHash).HasMaxLength(64);

        builder.HasIndex(x => x.TelegramId).IsUnique();

        builder.HasIndex(x => x.Phone).IsUnique();

        builder.HasIndex(x => x.RefreshTokenHash);

        builder.HasOne(x => x.Subscription)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.SubscriptionId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
