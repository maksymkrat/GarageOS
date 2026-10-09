using GarageOS.DAL.Context;
using GarageOS.DAL.Repositories;
using GarageOS.DAL.Repositories.Abstractions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace GarageOS.DAL;

public static class DependencyInjection
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<GarageDbContext>(options => options
            .UseNpgsql(connectionString)
            // Таблиці й колонки в snake_case — інакше в psql усе доведеться
            // брати в лапки через PascalCase.
            .UseSnakeCaseNamingConvention());

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IClientRepository, ClientRepository>();
        services.AddScoped<ICarRepository, CarRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IReminderRepository, ReminderRepository>();
        services.AddScoped<IMyVehicleRepository, MyVehicleRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IFinanceRepository, FinanceRepository>();

        return services;
    }
}
