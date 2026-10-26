using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IUserRepository
{
    Task<UserEntity?> GetByTelegramIdAsync(long telegramId, CancellationToken ct = default);

    Task<UserEntity?> GetByPhoneAsync(string phone, CancellationToken ct = default);

    Task<UserEntity?> GetByIdAsync(int id, CancellationToken ct = default);

    Task<UserEntity?> GetByRefreshTokenHashAsync(string refreshTokenHash, CancellationToken ct = default);

    void Add(UserEntity user);
}
