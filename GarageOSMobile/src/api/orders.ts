import type {
  ClientVehicle,
  CreateOrderInput,
  Order,
  OrderPart,
  OrderPartInput,
  OrderPhoto,
  OrderWork,
  OrderWorkInput,
  PhotoSize,
  UpdateOrderInput,
} from '@/types/domain';

import { authorizedSource, request, upload, type UploadFile } from './client';

export interface OrderDetail {
  order: Order;
  vehicle: ClientVehicle;

  // On the detail rather than on `Order`: the list screens do not show photos,
  // so there is no third `include*` flag and no collection that comes back
  // empty for two different reasons.
  photos: OrderPhoto[];
}

export function getOrders(includeLines: boolean): Promise<Order[]> {
  return request(`GET /orders?includeLines=${includeLines}`);
}

export function getOrderDetail(id: number): Promise<OrderDetail> {
  return request(`GET /orders/${id}`);
}

export function createOrder(input: CreateOrderInput): Promise<Order> {
  return request('POST /orders', input);
}

export function updateOrder(id: number, input: UpdateOrderInput): Promise<Order> {
  return request(`PUT /orders/${id}`, input);
}

export function deleteOrder(id: number): Promise<void> {
  return request(`DELETE /orders/${id}`);
}

// Settles the whole order at once: every line becomes paid and the vehicle
// becomes `ready`, so both come back together.
export function payOrder(id: number): Promise<OrderDetail> {
  return request(`POST /orders/${id}/pay`);
}

// Appends — a naryad keeps a gallery, so there is no photo to supersede.
export function addOrderPhoto(orderId: number, file: UploadFile): Promise<OrderPhoto> {
  return upload(`POST /orders/${orderId}/photos`, file);
}

export function deleteOrderPhoto(orderId: number, photoId: number): Promise<void> {
  return request(`DELETE /orders/${orderId}/photos/${photoId}`);
}

// A photo row's bytes never change, so this URL is safe to cache forever.
export function orderPhotoSource(orderId: number, photoId: number, size: PhotoSize) {
  return authorizedSource(`/orders/${orderId}/photos/${photoId}?size=${size}`);
}

export function createOrderWork(orderId: number, input: OrderWorkInput): Promise<OrderWork> {
  return request(`POST /orders/${orderId}/works`, input);
}

export function updateOrderWork(
  orderId: number,
  workId: number,
  input: OrderWorkInput
): Promise<OrderWork> {
  return request(`PUT /orders/${orderId}/works/${workId}`, input);
}

export function deleteOrderWork(orderId: number, workId: number): Promise<void> {
  return request(`DELETE /orders/${orderId}/works/${workId}`);
}

export function createOrderPart(orderId: number, input: OrderPartInput): Promise<OrderPart> {
  return request(`POST /orders/${orderId}/parts`, input);
}

export function updateOrderPart(
  orderId: number,
  partId: number,
  input: OrderPartInput
): Promise<OrderPart> {
  return request(`PUT /orders/${orderId}/parts/${partId}`, input);
}

export function deleteOrderPart(orderId: number, partId: number): Promise<void> {
  return request(`DELETE /orders/${orderId}/parts/${partId}`);
}
