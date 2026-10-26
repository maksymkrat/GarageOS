import type { ClientVehicle, FinancePeriod, FinanceStats } from '@/types/domain';

import { request } from './client';

export interface FinanceOverview {
  stats: FinanceStats;
  debtors: ClientVehicle[];
  totalDebt: number;
}

export function getFinanceOverview(period: FinancePeriod): Promise<FinanceOverview> {
  return request(`GET /finance?period=${period}`);
}
