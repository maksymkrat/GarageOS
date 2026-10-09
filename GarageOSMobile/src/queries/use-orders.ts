import { useQuery } from '@tanstack/react-query';

import { getOrderDetail, getOrders } from '@/api/orders';
import { queryKeys } from '@/queries/keys';

export function useOrders() {
  return useQuery({ queryKey: queryKeys.orders, queryFn: getOrders });
}

export function useOrderDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => getOrderDetail(id),
    enabled: Number.isFinite(id),
  });
}
