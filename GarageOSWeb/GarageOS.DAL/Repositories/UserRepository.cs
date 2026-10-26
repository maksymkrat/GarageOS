using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class UserRepository(GarageDbContext db) : IUserRepository
{
    public Task<UserEntity?> GetByTelegramIdAsync(long telegramId, CancellationToken ct = default) =>
        db.Users.FirstOrDefaultAsync(x => x.TelegramId == telegramId, ct);

    public Task<UserEntity?> GetByPhoneAsync(string phone, CancellationToken ct = default) =>
        db.Users.FirstOrDefaultAsync(x => x.Phone == phone, ct);

    public Task<UserEntity?> GetByIdAsync(int id, CancellationToken ct = default) =>
        db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);

    public Task<UserEntity?> GetByRefreshTokenHashAsync(string refreshTokenHash, CancellationToken ct = default) =>
        db.Users.FirstOrDefaultAsync(x => x.RefreshTokenHash == refreshTokenHash, ct);

    public void Add(UserEntity user) => db.Users.Add(user);
}
