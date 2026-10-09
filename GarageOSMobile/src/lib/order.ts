import type { Order } from '@/types/domain';

export interface OrderTotals {
  works: number;
  parts: number;
  total: number;
}

export function orderTotals(order: Order): OrderTotals {
  const works = order.works.reduce((sum, work) => sum + work.price, 0);
  const parts = order.parts.reduce((sum, part) => sum + part.sell * part.qty, 0);
  return { works, parts, total: works + parts };
}

export function orderDebt(order: Order): number {
  return orderTotals(order).total - order.paid;
}

/** Markup earned on resold parts — buy price vs. sell price. */
export function partsProfit(order: Order): number {
  return order.parts.reduce((sum, part) => sum + (part.sell - part.buy) * part.qty, 0);
}
