using GarageOS.DAL.Entities;

namespace GarageOS.DAL.Repositories.Abstractions;

public interface IClientRepository
{
    /// <summary>Пошук за номером: він природний ключ клієнта.</summary>
    Task<ClientEntity?> GetByPhoneAsync(string phone, CancellationToken ct = default);

    void Add(ClientEntity client);
}
