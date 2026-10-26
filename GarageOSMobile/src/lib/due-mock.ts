import type { MyVehicle } from '@/types/domain';

const MOCK_DUE: Record<number, string> = {
  1: 'Заміна масла через 600 км',
  3: 'Свічка — термін минув',
};

export function mockDue(vehicle: MyVehicle): string | undefined {
  return MOCK_DUE[vehicle.id];
}

export function mockDueCount(vehicles: MyVehicle[] | undefined): number {
  return vehicles?.filter((vehicle) => !!mockDue(vehicle)).length ?? 0;
}
