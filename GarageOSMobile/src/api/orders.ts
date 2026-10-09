import type { Car, Order } from '@/types/domain';

import { store } from './mock/store';
import { ApiError, request } from './mock/transport';

export interface OrderDetail {
  order: Order;
  car: Car;
}

export function getOrders(): Promise<Order[]> {
  return request('GET /orders', () => store.orders);
}

export function getOrderDetail(id: number): Promise<OrderDetail> {
  return request(`GET /orders/${id}`, () => {
    const order = store.orders.find((row) => row.id === id);
    if (!order) throw new ApiError('Наряд не знайдено', `GET /orders/${id}`, 404);

    const car = store.cars.find((row) => row.id === order.carId);
    if (!car) throw new ApiError('Авто наряду не знайдено', `GET /orders/${id}`, 404);

    return { order, car };
  });
}
