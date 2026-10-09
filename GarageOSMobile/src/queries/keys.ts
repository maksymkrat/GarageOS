import type { FinancePeriod } from '@/types/domain';

export const queryKeys = {
  cars: ['cars'] as const,
  car: (id: number) => ['cars', id] as const,
  orders: ['orders'] as const,
  order: (id: number) => ['orders', id] as const,
  reminders: ['reminders'] as const,
  finance: (period: FinancePeriod) => ['finance', period] as const,
  financeAll: ['finance'] as const,
  vehicles: ['vehicles'] as const,
  vehicle: (id: number) => ['vehicles', id] as const,
};
