namespace GarageOS.Services.Exceptions;

/// <summary>
/// Повідомлення українською і потрапляє користувачу на екран як є — так само,
/// як тексти в ApiError на клієнті.
/// </summary>
public sealed class NotFoundException(string message) : Exception(message);
