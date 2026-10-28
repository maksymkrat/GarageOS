import type { FinancePeriod } from '@/types/domain';

export const queryKeys = {
  bot: ['bot'] as const,
  clientVehicles: ['client-vehicles'] as const,
  clientVehicle: (id: number) => ['client-vehicles', id] as const,
  orders: (includeLines: boolean) => ['orders', { includeLines }] as const,
  ordersAll: ['orders'] as const,
  order: (id: number) => ['orders', id] as const,
  finance: (period: FinancePeriod) => ['finance', period] as const,
  financeAll: ['finance'] as const,
  vehiclesAll: ['vehicles'] as const,
  vehicles: (includeLog: boolean) => ['vehicles', { includeLog }] as const,
  vehicleAll: (id: number) => ['vehicles', id] as const,
  vehicle: (id: number, includeLog: boolean) => ['vehicles', id, { includeLog }] as const,
};
