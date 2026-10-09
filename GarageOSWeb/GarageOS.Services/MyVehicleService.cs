using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;

namespace GarageOS.Services;

/// <summary>
/// УВАГА: поки віддає техніку всіх користувачів. Контракт сьогодні саме такий —
/// поняття суб'єкта в ньому немає (05-cross-cutting). З появою автентифікації
/// обидва методи стануть фільтрувати за userId з токена, і це зміна контракту,
/// а не лише сервера (ADR-0005).
/// </summary>
public class MyVehicleService(IMyVehicleRepository vehicles) : IMyVehicleService
{
    public async Task<IReadOnlyList<MyVehicleDto>> GetVehiclesAsync(CancellationToken ct = default)
    {
        var rows = await vehicles.GetAllAsync(ct);
        return [.. rows.Select(x => x.ToModel().ToDto())];
    }

    public async Task<MyVehicleDto> GetVehicleAsync(int id, CancellationToken ct = default)
    {
        var vehicle = await vehicles.GetByIdAsync(id, ct)
                      ?? throw new NotFoundException("Техніку не знайдено");

        return vehicle.ToModel().ToDto();
    }
}
