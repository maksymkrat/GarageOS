using GarageOS.Services.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.ReplyMarkups;

namespace GarageOS.Telegram.Bot;

public sealed class BotUpdateHandler(
    IServiceScopeFactory scopes,
    ILogger<BotUpdateHandler> log) : IUpdateHandler
{
    private const string StartCommand = "/start";

    public async Task HandleUpdateAsync(ITelegramBotClient bot, Update update, CancellationToken ct)
    {
        if (update.Message is not { From: { } from } message) return;

        using var scope = scopes.CreateScope();
        var signIn = scope.ServiceProvider.GetRequiredService<ITelegramSignInService>();

        if (message.Contact is { } contact)
        {
            await HandleContactAsync(bot, message, from, contact, signIn, ct);
            return;
        }

        if (message.Text?.StartsWith(StartCommand, StringComparison.Ordinal) == true)
        {
            await HandleStartAsync(bot, message, from, signIn, ct);
        }
    }

    public Task HandleErrorAsync(
        ITelegramBotClient bot,
        Exception exception,
        HandleErrorSource source,
        CancellationToken ct)
    {
        log.LogError(exception, "Помилка бота ({Source})", source);

        return Task.CompletedTask;
    }

    private static async Task HandleStartAsync(
        ITelegramBotClient bot,
        Message message,
        User from,
        ITelegramSignInService signIn,
        CancellationToken ct)
    {
        var outcome = await signIn.HandleStartAsync(from.Id, ct);

        if (outcome == StartOutcome.NeedsPhone)
        {
            var keyboard = new ReplyKeyboardMarkup(KeyboardButton.WithRequestContact(BotTexts.ShareButton))
            {
                ResizeKeyboard = true,
                OneTimeKeyboard = true
            };

            await bot.SendMessage(
                message.Chat.Id,
                BotTexts.AskPhone,
                parseMode: ParseMode.Html,
                replyMarkup: keyboard,
                cancellationToken: ct);

            return;
        }

        await bot.SendMessage(
            message.Chat.Id,
            BotTexts.AlreadyActivated,
            parseMode: ParseMode.Html,
            replyMarkup: new ReplyKeyboardRemove(),
            cancellationToken: ct);
    }

    private static async Task HandleContactAsync(
        ITelegramBotClient bot,
        Message message,
        User from,
        Contact contact,
        ITelegramSignInService signIn,
        CancellationToken ct)
    {
        var outcome = await signIn.HandleContactAsync(
            new TelegramContact(
                from.Id,
                contact.UserId ?? 0,
                contact.PhoneNumber,
                from.FirstName,
                from.LastName),
            ct);

        var text = outcome switch
        {
            ContactOutcome.Activated => BotTexts.Activated,
            ContactOutcome.AlreadyActivated => BotTexts.AlreadyActivated,
            ContactOutcome.PhoneTaken => BotTexts.PhoneTaken,
            _ => BotTexts.ForeignContact
        };

        await bot.SendMessage(
            message.Chat.Id,
            text,
            parseMode: ParseMode.Html,
            replyMarkup: new ReplyKeyboardRemove(),
            cancellationToken: ct);
    }
}
