using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface ILoginCodeRepository
{
    Task<LoginCodeEntity?> GetActiveByUserIdAsync(int userId, CancellationToken ct = default);

    void Add(LoginCodeEntity code);

    Task<bool> TryConsumeAsync(int codeId, DateTime now, CancellationToken ct = default);

    Task RegisterFailedAttemptAsync(int codeId, DateTime now, CancellationToken ct = default);

    Task<int> DeleteExpiredAsync(DateTime before, CancellationToken ct = default);
}
