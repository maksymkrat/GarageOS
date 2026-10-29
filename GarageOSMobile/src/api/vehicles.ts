import type {
  CreateLogEntryInput,
  CreateMyVehicleInput,
  LogEntry,
  MyVehicle,
  PhotoSize,
  UpdateLogEntryInput,
  UpdateMyVehicleInput,
} from '@/types/domain';

import { authorizedSource, request, upload, type UploadFile } from './client';

export function getMyVehicles(includeLog: boolean): Promise<MyVehicle[]> {
  return request(`GET /my-vehicles?includeLog=${includeLog}`);
}

export function getMyVehicle(id: number, includeLog: boolean): Promise<MyVehicle> {
  return request(`GET /my-vehicles/${id}?includeLog=${includeLog}`);
}

export function createMyVehicle(input: CreateMyVehicleInput): Promise<MyVehicle> {
  return request('POST /my-vehicles', input);
}

export function updateMyVehicle(id: number, input: UpdateMyVehicleInput): Promise<MyVehicle> {
  return request(`PUT /my-vehicles/${id}`, input);
}

export function deleteMyVehicle(id: number): Promise<void> {
  return request(`DELETE /my-vehicles/${id}`);
}

export function setMyVehiclePhoto(id: number, file: UploadFile): Promise<MyVehicle> {
  return upload(`POST /my-vehicles/${id}/photo`, file);
}

export function deleteMyVehiclePhoto(id: number): Promise<MyVehicle> {
  return request(`DELETE /my-vehicles/${id}/photo`);
}

export function myVehiclePhotoSource(vehicleId: number, photoId: string, size: PhotoSize) {
  return authorizedSource(`/my-vehicles/${vehicleId}/photo/${photoId}?size=${size}`);
}

export function createLogEntry(vehicleId: number, input: CreateLogEntryInput): Promise<LogEntry> {
  return request(`POST /my-vehicles/${vehicleId}/log`, input);
}

export function updateLogEntry(
  vehicleId: number,
  entryId: number,
  input: UpdateLogEntryInput
): Promise<LogEntry> {
  return request(`PUT /my-vehicles/${vehicleId}/log/${entryId}`, input);
}

export function deleteLogEntry(vehicleId: number, entryId: number): Promise<void> {
  return request(`DELETE /my-vehicles/${vehicleId}/log/${entryId}`);
}
