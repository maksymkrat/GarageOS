namespace GarageOS.Services.Photos;

public sealed class StorageOptions
{
    public const string Section = "Storage";

    // Absolute path to the photo tree, and never inside the publish output or
    // wwwroot: publishing overwrites the first, and the second is served
    // without a token. Empty means "work it out for development"; on a server
    // it arrives as Storage__PhotosRoot pointing at a mounted volume, the way
    // the connection string arrives as ConnectionStrings__Garage (ADR-0026).
    public string PhotosRoot { get; set; } = string.Empty;
}
