using GarageOS.Services.Abstractions;
using GarageOS.Services.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace GarageOS.Api.Controllers;

[ApiController]
[Route("reminders")]
public class RemindersController(IReminderService reminders) : ControllerBase
{
    [HttpGet]
    public Task<IReadOnlyList<ReminderItemDto>> GetAll(CancellationToken ct) =>
        reminders.GetRemindersAsync(ct);
}
