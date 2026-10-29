using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using GarageOS.Api.Infrastructure;
using GarageOS.DAL;
using GarageOS.Services;
using GarageOS.Services.Photos;
using GarageOS.Services.Security;
using GarageOS.Telegram.Bot;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Garage")
    ?? throw new InvalidOperationException(
        "Не задано ConnectionStrings:Garage. Задай через user secrets — див. README.");

var jwtKey = builder.Configuration[$"{JwtOptions.Section}:Key"]
    ?? throw new InvalidOperationException(
        "Не задано Jwt:Key. Задай через user secrets — див. README.");

_ = builder.Configuration[$"{TelegramOptions.Section}:BotToken"]
    ?? throw new InvalidOperationException(
        "Не задано Telegram:BotToken. Задай через user secrets — див. README.");

if (string.IsNullOrWhiteSpace(builder.Configuration[$"{TelegramOptions.Section}:BotUsername"]))
{
    throw new InvalidOperationException(
        "Не задано Telegram:BotUsername. Це нік бота, якому належить Telegram:BotToken.");
}

var photosRoot = builder.Configuration[$"{StorageOptions.Section}:PhotosRoot"];

if (string.IsNullOrWhiteSpace(photosRoot))
{
    if (!builder.Environment.IsDevelopment())
    {
        throw new InvalidOperationException(
            "Не задано Storage:PhotosRoot. На сервері він приходить як " +
            "Storage__PhotosRoot і мусить вказувати на змонтований том поза " +
            "теками публікації — інакше фото зникнуть із наступним деплоєм.");
    }

    photosRoot = Path.Combine(builder.Environment.ContentRootPath, "..", "_data", "photos");
}

builder.Services.Configure<StorageOptions>(
    options => options.PhotosRoot = Path.GetFullPath(photosRoot));

builder.Services.AddDataAccess(connectionString);
builder.Services.AddBusinessServices();

builder.Services.AddAuth(builder.Configuration);
builder.Services.AddTelegramBot();

var jwtOptions = builder.Configuration.GetSection(JwtOptions.Section).Get<JwtOptions>() ?? new JwtOptions();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,

            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization(options => options.AddPolicy(
    AuthPolicies.Master,
    policy => policy.RequireClaim(AccessTokenFactory.MasterClaim, "true")));

builder.Services.AddRateLimiter(limiter =>
{
    limiter.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    limiter.AddPolicy(RateLimitPolicies.Auth, context => RateLimitPartition.GetFixedWindowLimiter(
        context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1)
        }));
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddExceptionHandler<BadRequestExceptionHandler>();
builder.Services.AddExceptionHandler<NotFoundExceptionHandler>();
builder.Services.AddExceptionHandler<AuthExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
