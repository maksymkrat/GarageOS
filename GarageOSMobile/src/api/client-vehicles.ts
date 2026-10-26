import type {
  ClientVehicle,
  CreateClientVehicleInput,
  Order,
  PhotoSize,
  UpdateClientVehicleStatusInput,
} from '@/types/domain';

import { authorizedSource, request, upload, type UploadFile } from './client';

export interface ClientVehicleDetail {
  vehicle: ClientVehicle;
  orders: Order[];
  sameOwnerCount: number;
}

export function getClientVehicles(): Promise<ClientVehicle[]> {
  return request('GET /client-vehicles');
}

export function getClientVehicleDetail(id: number): Promise<ClientVehicleDetail> {
  return request(`GET /client-vehicles/${id}`);
}

export function createClientVehicle(input: CreateClientVehicleInput): Promise<ClientVehicle> {
  return request('POST /client-vehicles', input);
}

// Replaces the car's photo, or sets its first one. The server crops, re-encodes
// and assigns the id, so the response carries the card with its new `photoId`.
export function setClientVehiclePhoto(id: number, file: UploadFile): Promise<ClientVehicle> {
  return upload(`POST /client-vehicles/${id}/photo`, file);
}

export function deleteClientVehiclePhoto(id: number): Promise<ClientVehicle> {
  return request(`DELETE /client-vehicles/${id}/photo`);
}

// `photoId` is in the path so the URL changes whenever the picture does; the
// cached copy on the device expires by itself.
export function clientVehiclePhotoSource(vehicleId: number, photoId: string, size: PhotoSize) {
  return authorizedSource(`/client-vehicles/${vehicleId}/photo/${photoId}?size=${size}`);
}

// Settles every order of this vehicle that still has unpaid lines, so the
// whole card comes back — the orders in it change too.
export function payClientVehicle(id: number): Promise<ClientVehicleDetail> {
  return request(`POST /client-vehicles/${id}/pay`);
}

export function updateClientVehicleStatus(
  id: number,
  input: UpdateClientVehicleStatusInput
): Promise<ClientVehicle> {
  return request(`PUT /client-vehicles/${id}/status`, input);
}
