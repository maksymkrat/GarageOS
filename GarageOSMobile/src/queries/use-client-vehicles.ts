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

// The same write as paying one order, only across every order of this car, so
// it drops the same caches.
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

// Written into the caches, not only invalidated: a replacement deletes the
// file the cached `photoId` points at, so until the re-read lands the list
// would be asking for a photo that no longer exists.
function afterPhotoWrite(client: QueryClient, id: number, vehicle: ClientVehicle) {
  client.setQueryData<ClientVehicle[]>(queryKeys.clientVehicles, (rows) =>
    rows?.map((row) => (row.id === id ? vehicle : row))
  );

  client.setQueryData<ClientVehicleDetail>(queryKeys.clientVehicle(id), (detail) =>
    detail === undefined ? undefined : { ...detail, vehicle }
  );

  // Both renditions: the list reads the thumbnail, the card the full one.
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

// For the create form: the car has no id to bind a hook to until its POST
// comes back, so the id travels with the file.
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
    // The status drives the work board and travels inside the order detail, so
    // both have to be re-read, not just this one card.
    onSuccess: () => {
      client.invalidateQueries({ queryKey: queryKeys.clientVehicle(id) });
      client.invalidateQueries({ queryKey: queryKeys.clientVehicles });
      client.invalidateQueries({ queryKey: queryKeys.ordersAll });
    },
  });
}
