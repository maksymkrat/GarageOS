using GarageOS.Services.Abstractions;
using Microsoft.Extensions.DependencyInjection;

namespace GarageOS.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddBusinessServices(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);

        services.AddScoped<ICarService, CarService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IReminderService, ReminderService>();
        services.AddScoped<IFinanceService, FinanceService>();
        services.AddScoped<IMyVehicleService, MyVehicleService>();

        return services;
    }
}
