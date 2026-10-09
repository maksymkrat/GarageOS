namespace GarageOS.Services.Dtos;

// Форми нижче дослівно повторюють GarageOSMobile/src/types/domain.ts і
// src/api/*.ts. Контракт клієнта — джерело істини (ADR-0002): міняти тут
// можна лише разом із тим файлом, в одному коміті.

public sealed record CarDto(
    int Id,
    string Plate,
    string Make,
    string Model,
    int Year,
    string Owner,
    string Phone,
    string Status,
    decimal Debt,
    int Mileage,
    string LastVisit,
    string? NextService);

public sealed record OrderWorkDto(string Name, decimal Price);

public sealed record OrderPartDto(string Name, int Qty, decimal Buy, decimal Sell);

public sealed record OrderDto(
    int Id,
    int CarId,
    string Date,
    string Description,
    IReadOnlyList<OrderWorkDto> Works,
    IReadOnlyList<OrderPartDto> Parts,
    string Status,
    decimal Paid,
    int DaysWaiting);

/// <summary>Відповідь <c>GET /cars/{id}</c>: склейка, якої немає в домені.</summary>
public sealed record CarDetailDto(CarDto Car, IReadOnlyList<OrderDto> Orders, int SameOwnerCount);

/// <summary>Відповідь <c>GET /orders/{id}</c>.</summary>
public sealed record OrderDetailDto(OrderDto Order, CarDto Car);

/// <summary>Нагадування, вже склеєне з авто — екран не робить другого запиту.</summary>
public sealed record ReminderItemDto(
    int Id,
    int CarId,
    string Plate,
    string Owner,
    string Phone,
    string What,
    bool Overdue);

public sealed record FinanceStatsDto(decimal Earned, decimal Works, decimal Parts, int Visits);

public sealed record FinanceOverviewDto(
    FinanceStatsDto Stats,
    IReadOnlyList<CarDto> Debtors,
    decimal TotalDebt);

public sealed record LogEntryDto(
    int Id,
    string Date,
    int Mileage,
    string Title,
    string? Note,
    decimal Cost,
    string Kind);

public sealed record MyVehicleDto(
    int Id,
    string Kind,
    string Name,
    int Year,
    int Mileage,
    string Unit,
    string? Due,
    IReadOnlyList<LogEntryDto> Log);

/// <summary>Тіло <c>POST /cars</c> — контрактний <c>CreateCarInput</c>.</summary>
public sealed record CreateCarRequest(
    string Plate,
    string Make,
    string Model,
    int? Year,
    int? Mileage,
    string Owner,
    string Phone,
    string? Complaint,
    bool CreateOrder);
