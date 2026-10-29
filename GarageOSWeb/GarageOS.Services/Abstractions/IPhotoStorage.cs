using GarageOS.Domain.Enums;

namespace GarageOS.Services.Abstractions;

public sealed record StoredPhoto(Stream Content, string ContentType);

public enum PhotoOwner
{
    ClientVehicle,
    MyVehicle,
    Order
}

public interface IPhotoStorage
{
    Task SaveAsync(
        PhotoOwner owner,
        int ownerId,
        Guid photoId,
        byte[] full,
        byte[] thumb,
        CancellationToken ct = default);

    StoredPhoto? Open(PhotoOwner owner, int ownerId, Guid photoId, PhotoSize size);

    void Delete(PhotoOwner owner, int ownerId, Guid photoId);

    void DeleteAll(PhotoOwner owner, int ownerId);
}
