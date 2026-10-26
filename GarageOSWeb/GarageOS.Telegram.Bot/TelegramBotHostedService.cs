using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types.Enums;

namespace GarageOS.Telegram.Bot;

public sealed class TelegramBotHostedService(
    ITelegramBotClient bot,
    BotUpdateHandler handler,
    ILogger<TelegramBotHostedService> log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var me = await bot.GetMe(stoppingToken);

        log.LogInformation("Бот @{Username} слухає апдейти через long polling", me.Username);

        var options = new ReceiverOptions
        {
            AllowedUpdates = [UpdateType.Message],

            DropPendingUpdates = true
        };

        await bot.ReceiveAsync(handler, options, stoppingToken);
    }
}
