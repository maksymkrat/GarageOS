using GarageOS.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GarageOS.DAL.Configurations;

public class LoginCodeConfiguration : IEntityTypeConfiguration<LoginCodeEntity>
{
    public void Configure(EntityTypeBuilder<LoginCodeEntity> builder)
    {
        builder.ToTable("login_codes");

        builder.Property(x => x.CodeHash).HasMaxLength(64).IsRequired();

        builder.HasIndex(x => x.UserId)
            .IsUnique()
            .HasFilter("consumed_at IS NULL")
            .HasDatabaseName("ix_login_codes_user_id_active");

        builder.HasIndex(x => x.ExpiresAt);

        builder.HasOne(x => x.User)
            .WithMany(x => x.LoginCodes)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
