using GarageOS.DAL.Context;
using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace GarageOS.DAL.Repositories;

public class ClientRepository(GarageDbContext db) : IClientRepository
{
    public Task<ClientEntity?> GetByPhoneAsync(string phone, CancellationToken ct = default) =>
        db.Clients.FirstOrDefaultAsync(x => x.Phone == phone, ct);

    public void Add(ClientEntity client) => db.Clients.Add(client);
}
