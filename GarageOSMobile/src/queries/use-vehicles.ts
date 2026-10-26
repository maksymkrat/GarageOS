import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import type { UploadFile } from '@/api/client';
import {
  createLogEntry,
  createMyVehicle,
  deleteLogEntry,
  deleteMyVehicle,
  deleteMyVehiclePhoto,
  getMyVehicle,
  getMyVehicles,
  myVehiclePhotoSource,
  setMyVehiclePhoto,
  updateLogEntry,
  updateMyVehicle,
} from '@/api/vehicles';
import { warmPhotoCache } from '@/lib/photo-cache';
import { queryKeys } from '@/queries/keys';
import type {
  CreateLogEntryInput,
  MyVehicle,
  UpdateLogEntryInput,
  UpdateMyVehicleInput,
} from '@/types/domain';

export function useMyVehicles(includeLog = true) {
  return useQuery({
    queryKey: queryKeys.vehicles(includeLog),
    queryFn: () => getMyVehicles(includeLog),
  });
}

export function useMyVehicle(id: number, includeLog = true) {
  return useQuery({
    queryKey: queryKeys.vehicle(id, includeLog),
    queryFn: () => getMyVehicle(id, includeLog),
    enabled: Number.isFinite(id),
  });
}

export function useCreateMyVehicle() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createMyVehicle,
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.vehiclesAll }),
  });
}

// Only the id: the write loads the vehicle without its log, so storing the
// answer whole would blank the log already on screen.
function patchPhotoId(client: QueryClient, id: number, photoId: string | undefined) {
  const patch = (vehicle: MyVehicle) => (vehicle.id === id ? { ...vehicle, photoId } : vehicle);

  client.setQueriesData<MyVehicle | MyVehicle[]>(
    { queryKey: queryKeys.vehiclesAll },
    (current) => {
      if (current === undefined) return current;

      return Array.isArray(current) ? current.map(patch) : patch(current);
    }
  );
}

export function useSetMyVehiclePhoto(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (file: UploadFile) => setMyVehiclePhoto(id, file),
    onSuccess: (vehicle) => {
      patchPhotoId(client, id, vehicle.photoId);

      if (vehicle.photoId !== undefined) {
        warmPhotoCache(myVehiclePhotoSource(id, vehicle.photoId, 'full'));
      }

      client.invalidateQueries({ queryKey: queryKeys.vehiclesAll });
    },
  });
}

export function useDeleteMyVehiclePhoto(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMyVehiclePhoto(id),
    onSuccess: (vehicle) => {
      patchPhotoId(client, id, vehicle.photoId);

      client.invalidateQueries({ queryKey: queryKeys.vehiclesAll });
    },
  });
}

export function useUpdateMyVehicle(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMyVehicleInput) => updateMyVehicle(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.vehiclesAll }),
  });
}

export function useDeleteMyVehicle(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteMyVehicle(id),
    // The vehicle is gone, so its own cached entry has to go with the lists —
    // leaving it would let a stale card render after the screen pops back.
    onSuccess: () => {
      client.removeQueries({ queryKey: queryKeys.vehicleAll(id) });
      client.invalidateQueries({ queryKey: queryKeys.vehiclesAll });
    },
  });
}

export function useCreateLogEntry(vehicleId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLogEntryInput) => createLogEntry(vehicleId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.vehiclesAll }),
  });
}

export function useUpdateLogEntry(vehicleId: number, entryId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateLogEntryInput) => updateLogEntry(vehicleId, entryId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.vehiclesAll }),
  });
}

export function useDeleteLogEntry(vehicleId: number, entryId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLogEntry(vehicleId, entryId),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.vehiclesAll }),
  });
}
