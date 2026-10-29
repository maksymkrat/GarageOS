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

export function setClientVehiclePhoto(id: number, file: UploadFile): Promise<ClientVehicle> {
  return upload(`POST /client-vehicles/${id}/photo`, file);
}

export function deleteClientVehiclePhoto(id: number): Promise<ClientVehicle> {
  return request(`DELETE /client-vehicles/${id}/photo`);
}

export function clientVehiclePhotoSource(vehicleId: number, photoId: string, size: PhotoSize) {
  return authorizedSource(`/client-vehicles/${vehicleId}/photo/${photoId}?size=${size}`);
}

export function payClientVehicle(id: number): Promise<ClientVehicleDetail> {
  return request(`POST /client-vehicles/${id}/pay`);
}

export function updateClientVehicleStatus(
  id: number,
  input: UpdateClientVehicleStatusInput
): Promise<ClientVehicle> {
  return request(`PUT /client-vehicles/${id}/status`, input);
}
