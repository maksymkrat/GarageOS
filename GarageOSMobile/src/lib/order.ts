import type { Order } from '@/types/domain';

export interface OrderTotals {
  works: number;
  parts: number;
  total: number;
}

export function orderTotals(order: Order): OrderTotals {
  const works = order.works.reduce((sum, work) => sum + work.price, 0);
  const parts = order.parts.reduce((sum, part) => sum + part.sell, 0);
  return { works, parts, total: works + parts };
}

export function orderDebt(order: Order): number {
  const works = order.works
    .filter((work) => work.paymentStatus === 'unpaid')
    .reduce((sum, work) => sum + work.price, 0);

  const parts = order.parts
    .filter((part) => part.paymentStatus === 'unpaid')
    .reduce((sum, part) => sum + part.sell, 0);

  return works + parts;
}

export function orderPaid(order: Order): boolean {
  return orderDebt(order) === 0;
}

export function orderEarnings(order: Order): number {
  const works = order.works.reduce((sum, work) => sum + work.price, 0);
  const parts = order.parts.reduce((sum, part) => sum + (part.sell - part.buy), 0);
  return works + parts;
}
