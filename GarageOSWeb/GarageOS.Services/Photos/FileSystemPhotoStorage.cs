using System.Globalization;
using GarageOS.Domain.Enums;
using GarageOS.Services.Abstractions;
using Microsoft.Extensions.Options;

namespace GarageOS.Services.Photos;

public sealed class FileSystemPhotoStorage(IOptions<StorageOptions> options) : IPhotoStorage
{
    private const int StreamBuffer = 64 * 1024;

    private readonly string _root = options.Value.PhotosRoot;

    public async Task SaveAsync(
        PhotoOwner owner,
        int ownerId,
        Guid photoId,
        byte[] full,
        byte[] thumb,
        CancellationToken ct = default)
    {
        var folder = Folder(owner, ownerId);

        Directory.CreateDirectory(folder);

        await WriteAtomicAsync(Path.Combine(folder, Name(photoId, PhotoSize.Full)), full, ct);
        await WriteAtomicAsync(Path.Combine(folder, Name(photoId, PhotoSize.Thumb)), thumb, ct);
    }

    public StoredPhoto? Open(PhotoOwner owner, int ownerId, Guid photoId, PhotoSize size)
    {
        var path = Path.Combine(Folder(owner, ownerId), Name(photoId, size));

        if (!File.Exists(path)) return null;

        var stream = new FileStream(
            path,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            StreamBuffer,
            useAsync: true);

        return new StoredPhoto(stream, PhotoProcessor.ContentType);
    }

    public void Delete(PhotoOwner owner, int ownerId, Guid photoId)
    {
        var folder = Folder(owner, ownerId);

        foreach (var size in Enum.GetValues<PhotoSize>())
        {
            var path = Path.Combine(folder, Name(photoId, size));

            if (File.Exists(path)) File.Delete(path);
        }
    }

    public void DeleteAll(PhotoOwner owner, int ownerId)
    {
        var folder = Folder(owner, ownerId);

        if (Directory.Exists(folder)) Directory.Delete(folder, recursive: true);
    }

    // Written to a temporary neighbour and moved into place. A crash halfway
    // through a write would otherwise leave a truncated image behind a row that
    // claims the photo is there, and a half-decoded picture is worse than none.
    private static async Task WriteAtomicAsync(string path, byte[] bytes, CancellationToken ct)
    {
        var temporary = path + ".tmp";

        await File.WriteAllBytesAsync(temporary, bytes, ct);

        File.Move(temporary, path, overwrite: true);
    }

    private string Folder(PhotoOwner owner, int ownerId) =>
        Path.Combine(_root, Segment(owner), ownerId.ToString(CultureInfo.InvariantCulture));

    private static string Segment(PhotoOwner owner) => owner switch
    {
        PhotoOwner.ClientVehicle => "client-vehicles",
        PhotoOwner.MyVehicle => "my-vehicles",
        PhotoOwner.Order => "orders",
        _ => throw new ArgumentOutOfRangeException(nameof(owner), owner, "Невідомий власник фото")
    };

    private static string Name(Guid photoId, PhotoSize size) =>
        size == PhotoSize.Thumb ? $"{photoId:N}-thumb.webp" : $"{photoId:N}.webp";
}
