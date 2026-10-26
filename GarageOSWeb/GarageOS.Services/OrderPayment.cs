using GarageOS.DAL.Entities;
using GarageOS.Domain.Enums;

namespace GarageOS.Services;

internal static class OrderPayment
{
    // Settling is one operation on two tables, reached both from an order's own
    // endpoint and from the car's card, so it lives in one place: every line of
    // the given orders becomes paid, and the car goes to Ready, because a car
    // that is paid for is a car the client drives away (ADR-0025).
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
