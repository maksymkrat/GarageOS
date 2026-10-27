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

// Inputs carry no id: the line being written is named by the path, and a new
// line has no id yet.
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

// Only the id travels: the file is fetched from its own endpoint, and the uuid
// that names it on disk never leaves the server (ADR-0027).
public sealed record OrderPhotoDto(int Id);

// Photos hang off the detail rather than off OrderDto, so there is no third
// `include*` flag and no collection that is empty for two different reasons
// ([ADR-0018](adr/0018-include-flags-for-nested-collections.md)).
public sealed record OrderDetailDto(
    OrderDto Order,
    ClientVehicleDto Vehicle,
    IReadOnlyList<OrderPhotoDto> Photos);

public sealed record ReminderItemDto(
    int Id,
    int ClientVehicleId,
    string Plate,
    string Owner,
    string Phone,
    string What,
    bool Overdue);

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

// PUT replaces the whole resource, so these repeat the create shapes field for
// field. They stay separate records because the two verbs may yet diverge —
// one contract entry each, as in domain.ts.
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

// Order lines have no identity in the contract, so OrderWorkDto and
// OrderPartDto serve as both input and output and PUT replaces the whole
// collection.
public sealed record UpdateClientVehicleStatusRequest(string Status);

public sealed record CreateOrderRequest(
    int ClientVehicleId,
    string Description,
    IReadOnlyList<OrderWorkRequest> Works,
    IReadOnlyList<OrderPartRequest> Parts);

// Only the complaint: lines are written one at a time through their own
// endpoints.
public sealed record UpdateOrderRequest(string Description);
