import type { Car, FinancePeriod, FinanceStats } from '@/types/domain';

import { store } from './mock/store';
import { request } from './mock/transport';

export interface FinanceOverview {
  stats: FinanceStats;
  debtors: Car[];
  totalDebt: number;
}

export function getFinanceOverview(period: FinancePeriod): Promise<FinanceOverview> {
  return request(`GET /finance?period=${period}`, () => {
    const debtors = store.cars
      .filter((car) => car.debt > 0)
      .sort((a, b) => b.debt - a.debt);

    return {
      stats: store.finance[period],
      debtors,
      totalDebt: debtors.reduce((sum, car) => sum + car.debt, 0),
    };
  });
}
