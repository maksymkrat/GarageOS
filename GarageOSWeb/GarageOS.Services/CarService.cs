using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Domain.Enums;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Mapping;

namespace GarageOS.Services;

public class CarService(
    ICarRepository cars,
    IClientRepository clients,
    IOrderRepository orders,
    IUnitOfWork uow,
    TimeProvider time) : ICarService
{
    private const string NoDescription = "Без опису";

    public async Task<IReadOnlyList<CarDto>> GetCarsAsync(CancellationToken ct = default)
    {
        var rows = await cars.GetAllAsync(ct);
        return [.. rows.Select(x => x.ToModel().ToDto())];
    }

    public async Task<CarDetailDto> GetCarDetailAsync(int id, CancellationToken ct = default)
    {
        var car = await cars.GetByIdAsync(id, ct)
                  ?? throw new NotFoundException("Авто не знайдено");

        var carOrders = await orders.GetByCarIdAsync(id, ct);
        var siblings = await cars.CountSiblingsAsync(car.ClientId, car.Id, ct);

        return new CarDetailDto(
            car.ToModel().ToDto(),
            [.. carOrders.Select(x => x.ToModel().ToDto())],
            siblings);
    }

    /// <summary>
    /// Нормалізація повторює createCar() з мок-транспорту: номер у верхньому
    /// регістрі, телефон — десять цифр, рік і пробіг мають запасні значення.
    /// </summary>
    public async Task<CarDto> CreateCarAsync(CreateCarRequest request, CancellationToken ct = default)
    {
        var today = DateOnly.FromDateTime(time.GetLocalNow().DateTime);
        var phone = ContractFormat.Phone(request.Phone);

        // Клієнт шукається за номером: у нормалізованій схемі власник більше не
        // дублюється в кожному авто. Наявному клієнту ім'я не перезаписуємо —
        // картка належить СТО, а не формі створення авто.
        var client = await clients.GetByPhoneAsync(phone, ct);
        if (client is null)
        {
            client = new ClientEntity { Name = request.Owner.Trim(), Phone = phone };
            clients.Add(client);
        }

        var car = new CarEntity
        {
            Client = client,
            Plate = request.Plate.Trim().ToUpperInvariant(),
            Make = request.Make.Trim(),
            Model = request.Model.Trim(),
            Year = request.Year ?? today.Year,
            Mileage = request.Mileage ?? 0,
            Status = request.CreateOrder ? CarStatus.InWork : CarStatus.Ready,
            Debt = 0m,
            LastVisit = today
        };
        cars.Add(car);

        if (request.CreateOrder)
        {
            orders.Add(new OrderEntity
            {
                Car = car,
                Date = today,
                Description = string.IsNullOrWhiteSpace(request.Complaint)
                    ? NoDescription
                    : request.Complaint.Trim(),
                Status = CarStatus.InWork,
                Paid = 0m,
                DaysWaiting = 0
            });
        }

        // Один SaveChanges на всі три таблиці — клієнт без авто не лишиться.
        await uow.SaveChangesAsync(ct);

        car.Client = client;
        return car.ToModel().ToDto();
    }
}
