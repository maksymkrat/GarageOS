import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCar, getCarDetail, getCars } from '@/api/cars';
import { queryKeys } from '@/queries/keys';

export function useCars() {
  return useQuery({ queryKey: queryKeys.cars, queryFn: getCars });
}

export function useCarDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.car(id),
    queryFn: () => getCarDetail(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateCar() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createCar,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.cars });
      client.invalidateQueries({ queryKey: queryKeys.orders });
      client.invalidateQueries({ queryKey: queryKeys.financeAll });
    },
  });
}
