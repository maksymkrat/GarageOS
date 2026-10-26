import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import type { UploadFile } from '@/api/client';
import { FormScreen } from '@/components/forms/form-screen';
import { OrderForm } from '@/components/forms/order-form';
import { QueryState } from '@/components/ui/query-state';
import { useClientVehicleDetail } from '@/queries/use-client-vehicles';
import { useAddNewOrderPhoto, useCreateOrder } from '@/queries/use-orders';

export default function NewOrderScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const id = Number(vehicleId);

  const detail = useClientVehicleDetail(id);
  const createOrder = useCreateOrder();
  const uploadPhoto = useAddNewOrderPhoto();

  // Held here until the order exists: the upload endpoint is addressed by the
  // order's id, and there is no id before the POST comes back (ADR-0027).
  const [photos, setPhotos] = useState<UploadFile[]>([]);

  async function submit(values: Parameters<typeof createOrder.mutateAsync>[0]) {
    const order = await createOrder.mutateAsync(values);

    // One request per photo, in order, so the gallery keeps the order they were
    // picked in. A failure here must not read as a failed order: the order is
    // already saved, so it is reported and the screen moves on.
    const failed: string[] = [];

    for (const photo of photos) {
      try {
        await uploadPhoto.mutateAsync({ orderId: order.id, file: photo });
      } catch (cause) {
        failed.push(cause instanceof Error ? cause.message : 'не вдалося');
      }
    }

    if (failed.length > 0) {
      Alert.alert(
        'Фото',
        `Наряд збережено, але ${failed.length} з ${photos.length} фото не завантажились: ` +
          `${failed[0]}. Додайте їх з екрана наряду.`
      );
    }

    router.replace(`/orders/${order.id}`);
  }

  return (
    <QueryState query={detail}>
      {({ vehicle }) => (
        <FormScreen
          back={`/client-vehicles/${id}`}
          title="Новий наряд"
          subtitle={`${vehicle.plate} · ${vehicle.make} ${vehicle.model}`}>
          <OrderForm
            submitLabel="Створити наряд"
            pending={createOrder.isPending}
            error={createOrder.error}
            photos={photos}
            onPhotos={setPhotos}
            onSubmit={(values) => void submit({ clientVehicleId: id, ...values })}
          />
        </FormScreen>
      )}
    </QueryState>
  );
}
