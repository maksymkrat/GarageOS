using GarageOS.Services.Abstractions;
using GarageOS.Services.Exceptions;
using GarageOS.Services.Security;
using Microsoft.Extensions.Options;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Types.Enums;

namespace GarageOS.Telegram.Bot;

public sealed class TelegramNotifier(
    ITelegramBotClient bot,
    IOptions<LoginCodeOptions> codeOptions) : ITelegramNotifier
{
    public Task SendCodeAsync(long telegramId, string code, CancellationToken ct = default)
    {
        var minutes = (int)Math.Ceiling(codeOptions.Value.Lifetime.TotalMinutes);

        return SendAsync(telegramId, string.Format(BotTexts.CodeMessage, code, minutes), ct);
    }

    public Task SendSignedInAsync(long telegramId, CancellationToken ct = default) =>
        SendAsync(telegramId, BotTexts.SignedIn, ct);

    private async Task SendAsync(long telegramId, string text, CancellationToken ct)
    {
        try
        {
            await bot.SendMessage(telegramId, text, parseMode: ParseMode.Html, cancellationToken: ct);
        }
        catch (ApiRequestException e) when (e.ErrorCode is 400 or 403)
        {
            throw new TelegramUnreachableException(
                $"Боту нікуди написати в чат {telegramId}: {e.Message}", e);
        }
    }
}
