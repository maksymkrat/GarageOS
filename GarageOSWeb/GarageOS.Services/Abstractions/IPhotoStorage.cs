using GarageOS.Domain.Enums;

namespace GarageOS.Services.Abstractions;

public sealed record StoredPhoto(Stream Content, string ContentType);

// Which entity a photo hangs on. An enum rather than a folder name because the
// caller never gets to spell a path: `client-vehicles/{int}` cannot be talked
// into climbing out of the photo tree.
public enum PhotoOwner
{
    ClientVehicle,
    MyVehicle,
    Order
}

// The file half of a photo, behind an interface because local disk stops
// working the moment a second instance stands behind a balancer — then
// S3-compatible storage is one class, not a rewrite ([ADR-0026]).
public interface IPhotoStorage
{
    Task SaveAsync(
        PhotoOwner owner,
        int ownerId,
        Guid photoId,
        byte[] full,
        byte[] thumb,
        CancellationToken ct = default);

    // Null when the file is gone although the row still points at it. Callers
    // turn that into a 404 rather than a 500: a missing file is a broken
    // picture, not a broken server.
    StoredPhoto? Open(PhotoOwner owner, int ownerId, Guid photoId, PhotoSize size);

    void Delete(PhotoOwner owner, int ownerId, Guid photoId);

    // Everything an owner has, for when the owner itself goes: the rows cascade
    // in the database, and without this the files would outlive them.
    void DeleteAll(PhotoOwner owner, int ownerId);
}
