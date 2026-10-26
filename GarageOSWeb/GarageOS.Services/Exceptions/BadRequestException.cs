namespace GarageOS.Services.Exceptions;

// Carries a Ukrainian message, like NotFoundException: the text goes to the
// person's screen as it is. BadRequestExceptionHandler turns it into a 400,
// which matters for uploads — a picture the server cannot decode is the
// client's problem, and answering 500 would blame the wrong side.
public sealed class BadRequestException(string message) : Exception(message);
