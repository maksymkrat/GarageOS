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

// The photo id travels inside the card, inside the garage list and inside the
// vehicle nested in an order detail, so a new picture drops all three.
function invalidatePhoto(client: QueryClient, id: number) {
  client.invalidateQueries({ queryKey: queryKeys.clientVehicle(id) });
  client.invalidateQueries({ queryKey: queryKeys.clientVehicles });
  client.invalidateQueries({ queryKey: queryKeys.ordersAll });
}

// What every successful photo write leaves behind, wherever it was started
// from. In one place because a write that skips it looks like it worked and
// then shows the car without its picture.
function afterPhotoWrite(client: QueryClient, id: number, vehicle: ClientVehicle) {
  // Written into the caches, not merely invalidated. The answer to the upload
  // *is* the new card, and an invalidation only promises a re-read — it has to
  // reach a mounted query to happen at all, and the garage list sits behind
  // the screen the photo was taken on. Until that re-read lands, the list
  // still holds the previous `photoId`, and a replacement deletes the picture
  // that id points at: the row would be asking the server for a photo that no
  // longer exists, which is an empty slot rather than a stale one.
  client.setQueryData<ClientVehicle[]>(queryKeys.clientVehicles, (rows) =>
    rows?.map((row) => (row.id === id ? vehicle : row))
  );

  client.setQueryData<ClientVehicleDetail>(queryKeys.clientVehicle(id), (detail) =>
    detail === undefined ? undefined : { ...detail, vehicle }
  );

  // Both renditions: the garage list reads the thumbnail and the card the
  // full one, and either screen may be the next one shown.
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

// The same write from the create form, where the id arrives with the file
// rather than with the hook: a car has no id to bind to until its POST comes
// back. Its own hook rather than a bare call to the API, because the garage
// list refetches the moment the car is created — a second before its photo
// exists — and nothing would ever tell it about the picture that followed.
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
    // The same path as setting one: removing a photo also leaves every cached
    // copy of the card pointing at a file that has just been unlinked.
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
