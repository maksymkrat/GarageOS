import { useMemo } from 'react';

import { useClientVehicles } from '@/queries/use-client-vehicles';
import { useOrders } from '@/queries/use-orders';
import type { ClientVehicle, ClientVehicleStatus } from '@/types/domain';

export interface WorkBoardRow {
  vehicle: ClientVehicle;
  description?: string;
  daysWaiting: number;
}

export function useWorkBoard() {
  const vehicles = useClientVehicles();
  const orders = useOrders();

  const rowsByStatus = useMemo(() => {
    const grouped: Partial<Record<ClientVehicleStatus, WorkBoardRow[]>> = {};
    if (!vehicles.data) return grouped;

    for (const vehicle of vehicles.data) {
      const order = orders.data?.find((row) => row.clientVehicleId === vehicle.id);
      const group = (grouped[vehicle.status] ??= []);
      group.push({ vehicle, description: order?.description, daysWaiting: order?.daysWaiting ?? 0 });
    }

    return grouped;
  }, [vehicles.data, orders.data]);

  return {
    rowsByStatus,
    isPending: vehicles.isPending || orders.isPending,
    error: vehicles.error ?? orders.error,
    refetch: () => {
      vehicles.refetch();
      orders.refetch();
    },
  };
}
