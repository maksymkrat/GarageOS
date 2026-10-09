import { useQuery } from '@tanstack/react-query';

import { getMyVehicle, getMyVehicles } from '@/api/vehicles';
import { queryKeys } from '@/queries/keys';

export function useMyVehicles() {
  return useQuery({ queryKey: queryKeys.vehicles, queryFn: getMyVehicles });
}

export function useMyVehicle(id: number) {
  return useQuery({
    queryKey: queryKeys.vehicle(id),
    queryFn: () => getMyVehicle(id),
    enabled: Number.isFinite(id),
  });
}
