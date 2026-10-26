import { useLocalSearchParams, useRouter } from 'expo-router';

import { FormScreen } from '@/components/forms/form-screen';
import { LogEntryForm } from '@/components/forms/log-entry-form';
import { QueryState } from '@/components/ui/query-state';
import { useCreateLogEntry, useMyVehicle } from '@/queries/use-vehicles';

export default function NewLogEntryScreen() {
  const router = useRouter();
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const id = Number(vehicleId);

  const vehicle = useMyVehicle(id);
  const createEntry = useCreateLogEntry(id);

  return (
    <QueryState query={vehicle}>
      {(item) => (
        <FormScreen back={`/personal/${id}`} title="Новий запис" subtitle={item.name}>
          <LogEntryForm
            mileageUnit={item.mileageUnit}
            submitLabel="Зберегти запис"
            pending={createEntry.isPending}
            error={createEntry.error}
            onSubmit={(values) => createEntry.mutate(values, { onSuccess: () => router.back() })}
          />
        </FormScreen>
      )}
    </QueryState>
  );
}
