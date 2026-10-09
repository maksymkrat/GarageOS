import type { MyVehicle } from '@/types/domain';

import { store } from './mock/store';
import { ApiError, request } from './mock/transport';

export function getMyVehicles(): Promise<MyVehicle[]> {
  return request('GET /my-vehicles', () => store.vehicles);
}

export function getMyVehicle(id: number): Promise<MyVehicle> {
  return request(`GET /my-vehicles/${id}`, () => {
    const vehicle = store.vehicles.find((row) => row.id === id);
    if (!vehicle) throw new ApiError('Техніку не знайдено', `GET /my-vehicles/${id}`, 404);
    return vehicle;
  });
}
