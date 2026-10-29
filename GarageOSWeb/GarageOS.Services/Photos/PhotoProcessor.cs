using GarageOS.Services.Exceptions;
using SkiaSharp;

namespace GarageOS.Services.Photos;

public sealed record ProcessedPhoto(byte[] Full, byte[] Thumb);

public static class PhotoProcessor
{
    public const string ContentType = "image/webp";

    public const int FullSide = 1024;
    public const int ThumbSide = 320;

    private const int FullQuality = 80;
    private const int ThumbQuality = 75;

    private const string Unreadable =
        "Не вдалося прочитати зображення. Надішліть фото у JPEG або PNG.";

    public static ProcessedPhoto Process(Stream upload)
    {
        using var bitmap = Decode(upload);

        var crop = CentreSquare(bitmap);

        return new ProcessedPhoto(
            Encode(bitmap, crop, FullSide, FullQuality),
            Encode(bitmap, crop, ThumbSide, ThumbQuality));
    }

    private static SKBitmap Decode(Stream upload)
    {
        using var codec = SKCodec.Create(upload) ?? throw new BadRequestException(Unreadable);

        var info = new SKImageInfo(
            codec.Info.Width,
            codec.Info.Height,
            SKColorType.Bgra8888,
            SKAlphaType.Premul);

        var bitmap = new SKBitmap(info);

        // IncompleteInput still yields a usable picture — a truncated upload is
        // better shown than rejected.
        if (codec.GetPixels(info, bitmap.GetPixels()) is not
            (SKCodecResult.Success or SKCodecResult.IncompleteInput))
        {
            bitmap.Dispose();
            throw new BadRequestException(Unreadable);
        }

        return Orient(bitmap, codec.EncodedOrigin);
    }

    private static SKBitmap Orient(SKBitmap source, SKEncodedOrigin origin)
    {
        // Every EXIF origin is one horizontal mirror followed by one rotation.
        var (degrees, mirror) = origin switch
        {
            SKEncodedOrigin.TopRight => (0, true),
            SKEncodedOrigin.BottomRight => (180, false),
            SKEncodedOrigin.BottomLeft => (180, true),
            SKEncodedOrigin.LeftTop => (270, true),
            SKEncodedOrigin.RightTop => (90, false),
            SKEncodedOrigin.RightBottom => (90, true),
            SKEncodedOrigin.LeftBottom => (270, false),
            _ => (0, false)
        };

        if (degrees == 0 && !mirror) return source;

        var quarter = degrees is 90 or 270;
        var width = quarter ? source.Height : source.Width;
        var height = quarter ? source.Width : source.Height;

        var target = new SKBitmap(width, height, source.ColorType, source.AlphaType);

        using (var canvas = new SKCanvas(target))
        {
            // Composed from the centre: rotating about the destination centre
            // puts the source centre there whatever the angle, and the swapped
            // side lengths take care of the bounding box. Canvas transforms
            // apply innermost first, so this mirrors the source, then rotates.
            canvas.Translate(width / 2f, height / 2f);
            canvas.RotateDegrees(degrees);

            if (mirror) canvas.Scale(-1, 1);

            // Nearest is exact here: this draw only rotates and mirrors, so every
            // source pixel lands on exactly one destination pixel.
            canvas.DrawBitmap(
                source,
                new SKPoint(-source.Width / 2f, -source.Height / 2f),
                new SKSamplingOptions(SKFilterMode.Nearest),
                paint: null);
        }

        source.Dispose();

        return target;
    }

    private static SKRectI CentreSquare(SKBitmap source)
    {
        var side = Math.Min(source.Width, source.Height);
        var left = (source.Width - side) / 2;
        var top = (source.Height - side) / 2;

        return new SKRectI(left, top, left + side, top + side);
    }

    private static byte[] Encode(SKBitmap source, SKRectI crop, int maxSide, int quality)
    {
        var side = Math.Min(maxSide, crop.Width);

        var info = new SKImageInfo(side, side, SKColorType.Bgra8888, SKAlphaType.Premul);

        using var surface = SKSurface.Create(info);
        using var image = SKImage.FromBitmap(source);

        surface.Canvas.DrawImage(
            image,
            SKRect.Create(crop.Left, crop.Top, crop.Width, crop.Height),
            SKRect.Create(0, 0, side, side),
            new SKSamplingOptions(SKCubicResampler.Mitchell),
            paint: null);

        using var snapshot = surface.Snapshot();
        using var data = snapshot.Encode(SKEncodedImageFormat.Webp, quality);

        return data.ToArray();
    }
}
