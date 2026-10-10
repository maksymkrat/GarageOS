using System.Text.Json.Serialization;
using GarageOS.Api.Infrastructure;
using GarageOS.DAL;
using GarageOS.Services;

var builder = WebApplication.CreateBuilder(args);

// Рядок підключення тримається в user secrets, а не в appsettings: там він
// потрапив би в git разом із паролем.
//   dotnet user-secrets set "ConnectionStrings:Garage" "..." --project GarageOS.Api
var connectionString = builder.Configuration.GetConnectionString("Garage")
    ?? throw new InvalidOperationException(
        "Не задано ConnectionStrings:Garage. Задай через user secrets — див. README.");

builder.Services.AddDataAccess(connectionString);
builder.Services.AddBusinessServices();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Контракт позначає необов'язкові поля як `nextService?: string`, тож їх
    // краще не надсилати зовсім, ніж надсилати null.
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddExceptionHandler<NotFoundExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.Run();
