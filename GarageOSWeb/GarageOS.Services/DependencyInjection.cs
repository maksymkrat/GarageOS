using GarageOS.Services.Abstractions;
using GarageOS.Services.Photos;
using GarageOS.Services.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GarageOS.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddBusinessServices(this IServiceCollection services)
    {
        services.AddSingleton(TimeProvider.System);

        // Holds nothing but the root path, so one instance is enough.
        services.AddSingleton<IPhotoStorage, FileSystemPhotoStorage>();

        services.AddScoped<IClientVehicleService, ClientVehicleService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IFinanceService, FinanceService>();
        services.AddScoped<IMyVehicleService, MyVehicleService>();

        return services;
    }

    public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.Section));
        services.Configure<TelegramOptions>(configuration.GetSection(TelegramOptions.Section));
        services.Configure<LoginCodeOptions>(configuration.GetSection(LoginCodeOptions.Section));

        services.AddSingleton<IAccessTokenFactory, AccessTokenFactory>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITelegramSignInService, TelegramSignInService>();

        return services;
    }
}
