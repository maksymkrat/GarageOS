import { useMemo } from 'react';

import { useCars } from '@/queries/use-cars';
import { useOrders } from '@/queries/use-orders';
import type { Car, CarStatus } from '@/types/domain';

export interface WorkBoardRow {
  car: Car;
  /** Complaint from the car's open order, when there is one. */
  description?: string;
  daysWaiting: number;
}

/** Cars currently on the floor, grouped by status, each joined with its open order. */
export function useWorkBoard() {
  const cars = useCars();
  const orders = useOrders();

  const rowsByStatus = useMemo(() => {
    const grouped: Partial<Record<CarStatus, WorkBoardRow[]>> = {};
    if (!cars.data) return grouped;

    for (const car of cars.data) {
      const order = orders.data?.find((row) => row.carId === car.id);
      const group = (grouped[car.status] ??= []);
      group.push({ car, description: order?.description, daysWaiting: order?.daysWaiting ?? 0 });
    }

    return grouped;
  }, [cars.data, orders.data]);

  return {
    rowsByStatus,
    isPending: cars.isPending || orders.isPending,
    error: cars.error ?? orders.error,
    refetch: () => {
      cars.refetch();
      orders.refetch();
    },
  };
}
