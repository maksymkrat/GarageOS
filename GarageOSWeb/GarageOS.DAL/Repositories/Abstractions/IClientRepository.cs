using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IClientRepository
{
    Task<ClientEntity?> GetByPhoneAsync(string phone, CancellationToken ct = default);

    void Add(ClientEntity client);
}
