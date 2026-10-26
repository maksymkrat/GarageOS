import { useLocalSearchParams, useRouter } from 'expo-router';

import { FormScreen } from '@/components/forms/form-screen';
import { MyVehicleForm } from '@/components/forms/my-vehicle-form';
import { DangerButton } from '@/components/ui/danger-button';
import { QueryState } from '@/components/ui/query-state';
import { useDeleteMyVehicle, useMyVehicle, useUpdateMyVehicle } from '@/queries/use-vehicles';

export default function EditMyVehicleScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const id = Number(vehicleId);

  const vehicle = useMyVehicle(id);
  const updateVehicle = useUpdateMyVehicle(id);
  const deleteVehicle = useDeleteMyVehicle(id);

  return (
    <QueryState query={vehicle}>
      {(item) => (
        <FormScreen back={`/personal/${id}`} title="Змінити техніку" subtitle={item.name}>
          <MyVehicleForm
            initial={{
              kind: item.kind,
              name: item.name,
              year: item.year,
              mileage: item.mileage,
              mileageUnit: item.mileageUnit,
            }}
            submitLabel="Зберегти зміни"
            pending={updateVehicle.isPending}
            error={updateVehicle.error ?? deleteVehicle.error}
            onSubmit={(values) =>
              updateVehicle.mutate(values, { onSuccess: () => router.back() })
            }>
            <DangerButton
              label="Видалити техніку"
              confirmTitle={`Видалити ${item.name}?`}
              confirmBody={
                item.log.length === 0
                  ? 'Техніку буде видалено назавжди.'
                  : `Разом із технікою зникнуть ${item.log.length} ${entryWord(item.log.length)} журналу. Це не скасувати.`
              }
              pending={deleteVehicle.isPending}
              onConfirm={() =>
                deleteVehicle.mutate(undefined, {
                  // The card this screen sits on top of is gone too, so going
                  // back would land on a 404 — replace the whole stack instead.
                  onSuccess: () => router.replace('/personal'),
                })
              }
            />
          </MyVehicleForm>
        </FormScreen>
      )}
    </QueryState>
  );
}

function entryWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'запис';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'записи';

  return 'записів';
}
