namespace GarageOS.Services.Photos;

public sealed class StorageOptions
{
    public const string Section = "Storage";

    public string PhotosRoot { get; set; } = string.Empty;
}
