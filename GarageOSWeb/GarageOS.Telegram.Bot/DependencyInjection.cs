using GarageOS.Services.Abstractions;
using GarageOS.Services.Security;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Telegram.Bot;

namespace GarageOS.Telegram.Bot;

public static class DependencyInjection
{
    public static IServiceCollection AddTelegramBot(this IServiceCollection services)
    {
        services.AddSingleton<ITelegramBotClient>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<TelegramOptions>>().Value;

            return new TelegramBotClient(options.BotToken);
        });

        services.AddSingleton<BotUpdateHandler>();
        services.AddSingleton<ITelegramNotifier, TelegramNotifier>();
        services.AddHostedService<TelegramBotHostedService>();

        return services;
    }
}
