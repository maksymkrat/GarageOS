import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import type { UploadFile } from '@/api/client';
import {
  addOrderPhoto,
  createOrder,
  createOrderPart,
  createOrderWork,
  deleteOrder,
  deleteOrderPart,
  deleteOrderPhoto,
  deleteOrderWork,
  getOrderDetail,
  getOrders,
  payOrder,
  updateOrder,
  updateOrderPart,
  orderPhotoSource,
  updateOrderWork,
} from '@/api/orders';
import { warmPhotoCache } from '@/lib/photo-cache';
import { queryKeys } from '@/queries/keys';
import type { OrderPartInput, OrderWorkInput, UpdateOrderInput } from '@/types/domain';

export function useOrders(includeLines = false) {
  return useQuery({
    queryKey: queryKeys.orders(includeLines),
    queryFn: () => getOrders(includeLines),
  });
}

export function useOrderDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => getOrderDetail(id),
    enabled: Number.isFinite(id),
  });
}

export function invalidateOrderWorld(client: QueryClient) {
  client.invalidateQueries({ queryKey: queryKeys.ordersAll });
  client.invalidateQueries({ queryKey: queryKeys.clientVehicles });
  client.invalidateQueries({ queryKey: queryKeys.financeAll });
}

export function useCreateOrder() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => invalidateOrderWorld(client),
  });
}

export function useUpdateOrder(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateOrderInput) => updateOrder(id, input),
    onSuccess: () => invalidateOrderWorld(client),
  });
}

export function useDeleteOrder(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteOrder(id),
    onSuccess: () => {
      client.removeQueries({ queryKey: queryKeys.order(id) });
      invalidateOrderWorld(client);
    },
  });
}

export function usePayOrder(id: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => payOrder(id),
    onSuccess: () => invalidateOrderWorld(client),
  });
}

export function useAddOrderPhoto(orderId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (file: UploadFile) => addOrderPhoto(orderId, file),
    onSuccess: (photo) => {
      warmPhotoCache(orderPhotoSource(orderId, photo.id, 'thumb'));

      client.invalidateQueries({ queryKey: queryKeys.order(orderId) });
    },
  });
}

export function useAddNewOrderPhoto() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, file }: { orderId: number; file: UploadFile }) =>
      addOrderPhoto(orderId, file),
    onSuccess: (photo, { orderId }) => {
      warmPhotoCache(orderPhotoSource(orderId, photo.id, 'thumb'));

      client.invalidateQueries({ queryKey: queryKeys.order(orderId) });
    },
  });
}

export function useDeleteOrderPhoto(orderId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (photoId: number) => deleteOrderPhoto(orderId, photoId),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.order(orderId) }),
  });
}

export function useSaveOrderWork(orderId: number, workId?: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: OrderWorkInput) =>
      workId === undefined
        ? createOrderWork(orderId, input)
        : updateOrderWork(orderId, workId, input),
    onSuccess: () => invalidateOrderWorld(client),
  });
}

export function useDeleteOrderWork(orderId: number, workId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteOrderWork(orderId, workId),
    onSuccess: () => invalidateOrderWorld(client),
  });
}

export function useSaveOrderPart(orderId: number, partId?: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (input: OrderPartInput) =>
      partId === undefined
        ? createOrderPart(orderId, input)
        : updateOrderPart(orderId, partId, input),
    onSuccess: () => invalidateOrderWorld(client),
  });
}

export function useDeleteOrderPart(orderId: number, partId: number) {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => deleteOrderPart(orderId, partId),
    onSuccess: () => invalidateOrderWorld(client),
  });
}
