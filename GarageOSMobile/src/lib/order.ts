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

// Read off the lines, not stored: ADR-0016 keeps payment on the line, so the
// order has no `paid` flag of its own that could disagree with them. An order
// without lines reads as paid, because nothing on it is owed.
export function orderPaid(order: Order): boolean {
  return orderDebt(order) === 0;
}

// What the shop keeps, as opposed to `orderTotals().total`, which is what the
// client owes: a work is earned whole, a part only above its buy price.
export function orderEarnings(order: Order): number {
  const works = order.works.reduce((sum, work) => sum + work.price, 0);
  const parts = order.parts.reduce((sum, part) => sum + (part.sell - part.buy), 0);
  return works + parts;
}
