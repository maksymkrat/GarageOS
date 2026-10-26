using GarageOS.DAL.Entities;
using GarageOS.DAL.Repositories.Abstractions;
using GarageOS.Services.Abstractions;
using GarageOS.Services.Mapping;
using Microsoft.Extensions.Logging;

namespace GarageOS.Services;

public class TelegramSignInService(
    IUserRepository users,
    IClientRepository clients,
    IUnitOfWork uow,
    ILogger<TelegramSignInService> log) : ITelegramSignInService
{
    private const string UnnamedUser = "Без імені";

    public async Task<StartOutcome> HandleStartAsync(long telegramId, CancellationToken ct = default)
    {
        var user = await users.GetByTelegramIdAsync(telegramId, ct);

        return user is null ? StartOutcome.NeedsPhone : StartOutcome.AlreadyActivated;
    }

    public async Task<ContactOutcome> HandleContactAsync(TelegramContact contact, CancellationToken ct = default)
    {
        if (contact.ContactUserId != contact.TelegramId)
        {
            log.LogWarning(
                "Чужий контакт у чаті {TelegramId}: надіслано {ContactUserId}",
                contact.TelegramId,
                contact.ContactUserId);

            return ContactOutcome.Rejected;
        }

        if (await users.GetByTelegramIdAsync(contact.TelegramId, ct) is not null)
        {
            return ContactOutcome.AlreadyActivated;
        }

        var phone = ContractFormat.Phone(contact.PhoneNumber);

        if (await users.GetByPhoneAsync(phone, ct) is not null)
        {
            return ContactOutcome.PhoneTaken;
        }

        var user = new UserEntity
        {
            TelegramId = contact.TelegramId,
            Phone = phone,
            FirstName = string.IsNullOrWhiteSpace(contact.FirstName)
                ? UnnamedUser
                : contact.FirstName.Trim(),
            LastName = string.IsNullOrWhiteSpace(contact.LastName) ? null : contact.LastName.Trim()
        };

        users.Add(user);

        var client = await clients.GetByPhoneAsync(phone, ct);

        if (client is not null && client.UserId is null)
        {
            client.User = user;
        }

        await uow.SaveChangesAsync(ct);

        return ContactOutcome.Activated;
    }
}
