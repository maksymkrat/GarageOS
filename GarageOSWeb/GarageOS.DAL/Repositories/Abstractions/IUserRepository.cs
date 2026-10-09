using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IUserRepository
{
    /// <summary>Пошук профілю за claim <c>sub</c> з ID-токена Firebase (ADR-0005).</summary>
    Task<UserEntity?> GetByFirebaseUidAsync(string firebaseUid, CancellationToken ct = default);

    void Add(UserEntity user);
}
