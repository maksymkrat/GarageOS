namespace GarageOS.Services.Exceptions;

public sealed class NotFoundException(string message) : Exception(message);
