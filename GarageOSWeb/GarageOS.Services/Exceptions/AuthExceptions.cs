namespace GarageOS.Services.Exceptions;

public sealed class UnauthorizedException(string message) : Exception(message);

public sealed class TooManyRequestsException(string message) : Exception(message);

public sealed class TelegramUnreachableException(string message, Exception? innerException = null)
    : Exception(message, innerException);
