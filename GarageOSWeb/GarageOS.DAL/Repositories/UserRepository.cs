using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class UserRepository(GarageDbContext db) : IUserRepository
{
    public Task<UserEntity?> GetByFirebaseUidAsync(string firebaseUid, CancellationToken ct = default) =>
        db.Users.FirstOrDefaultAsync(x => x.FirebaseUid == firebaseUid, ct);

    public void Add(UserEntity user) => db.Users.Add(user);
}
