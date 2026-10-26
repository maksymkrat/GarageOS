using System.Security.Cryptography;
using System.Text;

namespace GarageOS.Services.Security;

public static class Secrets
{
    public static string Hash(string value) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(value)));

    public static string NewRefreshToken() =>
        Convert.ToHexStringLower(RandomNumberGenerator.GetBytes(32));

    public static string NewCode(int digits)
    {
        var buffer = new char[digits];

        for (var i = 0; i < digits; i++)
        {
            buffer[i] = (char)('0' + RandomNumberGenerator.GetInt32(0, 10));
        }

        return new string(buffer);
    }

    public static bool FixedTimeEquals(string left, string right) =>
        CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(left),
            Encoding.UTF8.GetBytes(right));

    public static string Digits(string raw) => new([.. raw.Where(char.IsDigit)]);
}
