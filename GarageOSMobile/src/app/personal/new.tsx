import { useRouter } from 'expo-router';

import { FormScreen } from '@/components/forms/form-screen';
import { MyVehicleForm } from '@/components/forms/my-vehicle-form';
import { useCreateMyVehicle } from '@/queries/use-vehicles';

export default function NewMyVehicleScreen() {
  const router = useRouter();
  const createVehicle = useCreateMyVehicle();

  return (
    <FormScreen back="/personal" title="Нова техніка">
      <MyVehicleForm
        submitLabel="Зберегти техніку"
        pending={createVehicle.isPending}
        error={createVehicle.error}
        onSubmit={(values) =>
          createVehicle.mutate(values, {
            onSuccess: (vehicle) => router.replace(`/personal/${vehicle.id}`),
          })
        }
      />
    </FormScreen>
  );
}
