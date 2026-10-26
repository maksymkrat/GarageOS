using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class LoginCodeRepository(GarageDbContext db) : ILoginCodeRepository
{
    public Task<LoginCodeEntity?> GetActiveByUserIdAsync(int userId, CancellationToken ct = default) =>
        db.LoginCodes.FirstOrDefaultAsync(x => x.UserId == userId && x.ConsumedAt == null, ct);

    public void Add(LoginCodeEntity code) => db.LoginCodes.Add(code);

    public async Task<bool> TryConsumeAsync(int codeId, DateTime now, CancellationToken ct = default)
    {
        var affected = await db.LoginCodes
            .Where(x => x.Id == codeId && x.ConsumedAt == null)
            .ExecuteUpdateAsync(
                set => set
                    .SetProperty(x => x.ConsumedAt, now)
                    .SetProperty(x => x.UpdatedAt, now),
                ct);

        return affected == 1;
    }

    public Task RegisterFailedAttemptAsync(int codeId, DateTime now, CancellationToken ct = default) =>
        db.LoginCodes
            .Where(x => x.Id == codeId)
            .ExecuteUpdateAsync(
                set => set
                    .SetProperty(x => x.Attempts, x => x.Attempts + 1)
                    .SetProperty(x => x.UpdatedAt, now),
                ct);

    public Task<int> DeleteExpiredAsync(DateTime before, CancellationToken ct = default) =>
        db.LoginCodes
            .Where(x => x.ExpiresAt < before)
            .ExecuteDeleteAsync(ct);
}
