using GarageOS.DAL.Entities;
using GarageOS.Domain.Enums;

namespace GarageOS.Services;

internal static class OrderPayment
{
    public static void Settle(IEnumerable<OrderEntity> orders, ClientVehicleEntity vehicle)
    {
        foreach (var order in orders)
        {
            foreach (var work in order.Works) work.PaymentStatus = PaymentStatus.Paid;
            foreach (var part in order.Parts) part.PaymentStatus = PaymentStatus.Paid;
        }

        vehicle.Status = ClientVehicleStatus.Ready;
    }
}
