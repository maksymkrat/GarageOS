import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import type { UploadFile } from '@/api/client';
import type { ClientVehicleDetail } from '@/api/client-vehicles';
import {
  clientVehiclePhotoSource,
  createClientVehicle,
  deleteClientVehiclePhoto,
  getClientVehicleDetail,
  getClientVehicles,
  payClientVehicle,
  setClientVehiclePhoto,
  updateClientVehicleStatus,
} from '@/api/client-vehicles';
import { warmPhotoCache } from '@/lib/photo-cache';
import { queryKeys } from '@/queries/keys';
import { invalidateOrderWorld } from '@/queries/use-orders';
import type { ClientVehicle, UpdateClientVehicleStatusInput } from '@/types/domain';

export function useClientVehicles() {
  return useQuery({ queryKey: queryKeys.clientVehicles, queryFn: getClientVehicles });
}

export function useClientVehicleDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.clientVehicle(id),
    queryFn: () => getClientVehicleDetail(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateClientVehicle() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createClientVehicle,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.clientVehicles });
      client.invalidateQueries({ queryKey: queryKeys.ordersAll });
      client.invalidateQueries({ queryKey: queryKeys.financeAll });
    },
  });
}

export function usePayClientVehicle(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => payClientVehicle(id),
    onSuccess: () => invalidateOrderWorld(client),
  });
}

function invalidatePhoto(client: QueryClient, id: number) {
  client.invalidateQueries({ queryKey: queryKeys.clientVehicle(id) });
  client.invalidateQueries({ queryKey: queryKeys.clientVehicles });
  client.invalidateQueries({ queryKey: queryKeys.ordersAll });
}

function afterPhotoWrite(client: QueryClient, id: number, vehicle: ClientVehicle) {
  client.setQueryData<ClientVehicle[]>(queryKeys.clientVehicles, (rows) =>
    rows?.map((row) => (row.id === id ? vehicle : row))
  );

  client.setQueryData<ClientVehicleDetail>(queryKeys.clientVehicle(id), (detail) =>
    detail === undefined ? undefined : { ...detail, vehicle }
  );

  if (vehicle.photoId !== undefined) {
    warmPhotoCache(
      clientVehiclePhotoSource(id, vehicle.photoId, 'thumb'),
      clientVehiclePhotoSource(id, vehicle.photoId, 'full')
    );
  }

  invalidatePhoto(client, id);
}

export function useSetClientVehiclePhoto(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (file: UploadFile) => setClientVehiclePhoto(id, file),
    onSuccess: (vehicle) => afterPhotoWrite(client, id, vehicle),
  });
}

export function useSetNewClientVehiclePhoto() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: UploadFile }) =>
      setClientVehiclePhoto(id, file),
    onSuccess: (vehicle, { id }) => afterPhotoWrite(client, id, vehicle),
  });
}

export function useDeleteClientVehiclePhoto(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteClientVehiclePhoto(id),
    onSuccess: (vehicle) => afterPhotoWrite(client, id, vehicle),
  });
}

export function useUpdateClientVehicleStatus(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateClientVehicleStatusInput) => updateClientVehicleStatus(id, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.clientVehicle(id) });
      client.invalidateQueries({ queryKey: queryKeys.clientVehicles });
      client.invalidateQueries({ queryKey: queryKeys.ordersAll });
    },
  });
}
