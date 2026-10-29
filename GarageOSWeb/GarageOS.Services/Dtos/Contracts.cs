namespace GarageOS.Services.Dtos;

public sealed record ClientVehicleDto(
    int Id,
    string Plate,
    string Kind,
    string Make,
    string Model,
    int? Year,
    string Owner,
    string Phone,
    string Status,
    decimal Debt,
    int? Mileage,
    string MileageUnit,
    string LastVisit,
    string? NextService,
    string? PhotoId);

public sealed record OrderWorkDto(int Id, string Description, decimal Price, string PaymentStatus);

public sealed record OrderPartDto(int Id, string Description, decimal Buy, decimal Sell, string PaymentStatus);

public sealed record OrderWorkRequest(string Description, decimal Price, string PaymentStatus);

public sealed record OrderPartRequest(string Description, decimal Buy, decimal Sell, string PaymentStatus);

public sealed record OrderDto(
    int Id,
    int ClientVehicleId,
    string Date,
    string Description,
    IReadOnlyList<OrderWorkDto> Works,
    IReadOnlyList<OrderPartDto> Parts,
    int DaysWaiting);

public sealed record ClientVehicleDetailDto(
    ClientVehicleDto Vehicle,
    IReadOnlyList<OrderDto> Orders,
    int SameOwnerCount);

public sealed record OrderPhotoDto(int Id);

public sealed record OrderDetailDto(
    OrderDto Order,
    ClientVehicleDto Vehicle,
    IReadOnlyList<OrderPhotoDto> Photos);

public sealed record FinanceStatsDto(decimal Earned, decimal Works, decimal Parts, int Visits);

public sealed record FinanceOverviewDto(
    FinanceStatsDto Stats,
    IReadOnlyList<ClientVehicleDto> Debtors,
    decimal TotalDebt);

public sealed record LogEntryDto(
    int Id,
    string Date,
    string Note,
    decimal Cost,
    string Kind,
    int? Mileage,
    string MileageUnit);

public sealed record MyVehicleDto(
    int Id,
    string Kind,
    string Name,
    int Year,
    int Mileage,
    string MileageUnit,
    IReadOnlyList<LogEntryDto> Log,
    string? PhotoId);

public sealed record CreateClientVehicleRequest(
    string Plate,
    string Kind,
    string Make,
    string Model,
    int? Year,
    int? Mileage,
    string? MileageUnit,
    string Owner,
    string Phone,
    string? Complaint,
    bool CreateOrder);

public sealed record CreateMyVehicleRequest(
    string Kind,
    string Name,
    int Year,
    int Mileage,
    string MileageUnit);

public sealed record CreateLogEntryRequest(
    string Note,
    decimal Cost,
    string Kind,
    int? Mileage);

public sealed record UpdateMyVehicleRequest(
    string Kind,
    string Name,
    int Year,
    int Mileage,
    string MileageUnit);

public sealed record UpdateLogEntryRequest(
    string Note,
    decimal Cost,
    string Kind,
    int? Mileage);

public sealed record UpdateClientVehicleStatusRequest(string Status);

public sealed record CreateOrderRequest(
    int ClientVehicleId,
    string Description,
    IReadOnlyList<OrderWorkRequest> Works,
    IReadOnlyList<OrderPartRequest> Parts);

public sealed record UpdateOrderRequest(string Description);
