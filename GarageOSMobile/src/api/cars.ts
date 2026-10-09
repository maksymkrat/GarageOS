import type { Car, CreateCarInput, Order } from '@/types/domain';

import { nextId, store } from './mock/store';
import { ApiError, request } from './mock/transport';
import { todayLabel } from '@/lib/format';

export interface CarDetail {
  car: Car;
  orders: Order[];
  /** Other cars registered to the same phone number. */
  sameOwnerCount: number;
}

export function getCars(): Promise<Car[]> {
  return request('GET /cars', () => store.cars);
}

export function getCarDetail(id: number): Promise<CarDetail> {
  return request(`GET /cars/${id}`, () => {
    const car = store.cars.find((row) => row.id === id);
    if (!car) throw new ApiError('Авто не знайдено', `GET /cars/${id}`, 404);

    return {
      car,
      orders: store.orders.filter((order) => order.carId === id),
      sameOwnerCount: store.cars.filter((row) => row.phone === car.phone && row.id !== id).length,
    };
  });
}

export function createCar(input: CreateCarInput): Promise<Car> {
  return request('POST /cars', () => {
    const car: Car = {
      id: nextId(store.cars),
      plate: input.plate.trim().toUpperCase(),
      make: input.make.trim(),
      model: input.model.trim(),
      year: input.year ?? new Date().getFullYear(),
      owner: input.owner.trim(),
      phone: input.phone.replace(/\D/g, '').slice(-10),
      status: input.createOrder ? 'in_work' : 'ready',
      debt: 0,
      mileage: input.mileage ?? 0,
      lastVisit: todayLabel(),
    };

    store.cars.unshift(car);

    if (input.createOrder) {
      store.orders.unshift({
        id: nextId(store.orders),
        carId: car.id,
        date: car.lastVisit,
        description: input.complaint?.trim() || 'Без опису',
        works: [],
        parts: [],
        status: 'in_work',
        paid: 0,
        daysWaiting: 0,
      });
    }

    return car;
  });
}
