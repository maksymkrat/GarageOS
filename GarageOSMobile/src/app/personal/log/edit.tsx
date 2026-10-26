import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { FormScreen } from '@/components/forms/form-screen';
import { LogEntryForm } from '@/components/forms/log-entry-form';
import { DangerButton } from '@/components/ui/danger-button';
import { QueryState } from '@/components/ui/query-state';
import { useDeleteLogEntry, useMyVehicle, useUpdateLogEntry } from '@/queries/use-vehicles';
import { colors, spacing } from '@/theme/tokens';

export default function EditLogEntryScreen() {
  const router = useRouter();
  const { vehicleId, entryId } = useLocalSearchParams<{ vehicleId: string; entryId: string }>();
  const id = Number(vehicleId);
  const entry = Number(entryId);

  const vehicle = useMyVehicle(id);
  const updateEntry = useUpdateLogEntry(id, entry);
  const deleteEntry = useDeleteLogEntry(id, entry);

  return (
    <QueryState query={vehicle}>
      {(item) => {
        // There is no endpoint for a single entry: the log arrives inside the
        // vehicle, so the entry is looked up in what is already loaded.
        const current = item.log.find((candidate) => candidate.id === entry);

        if (current === undefined) {
          return (
            <FormScreen back={`/personal/${id}`} title="Запис не знайдено">
              <Text style={styles.missing}>
                Цього запису вже немає — можливо, його видалено.
              </Text>
            </FormScreen>
          );
        }

        return (
          <FormScreen back={`/personal/${id}`} title="Змінити запис" subtitle={item.name}>
            <LogEntryForm
              initial={{
                kind: current.kind,
                note: current.note,
                cost: current.cost,
                mileage: current.mileage,
              }}
              mileageUnit={current.mileageUnit}
              submitLabel="Зберегти зміни"
              pending={updateEntry.isPending}
              error={updateEntry.error ?? deleteEntry.error}
              onSubmit={(values) =>
                updateEntry.mutate(values, { onSuccess: () => router.back() })
              }>
              <DangerButton
                label="Видалити запис"
                confirmTitle="Видалити запис?"
                confirmBody={`«${current.note}» зникне з журналу назавжди.`}
                pending={deleteEntry.isPending}
                onConfirm={() => deleteEntry.mutate(undefined, { onSuccess: () => router.back() })}
              />
            </LogEntryForm>

            <Text style={styles.note}>
              Дата запису — {current.date}, і правка її не змінює: дата фіксується
              моментом створення
            </Text>
          </FormScreen>
        );
      }}
    </QueryState>
  );
}

const styles = StyleSheet.create({
  missing: {
    fontSize: 13,
    color: colors.textMuted,
  },
  note: {
    marginTop: spacing.md,
    fontSize: 11,
    color: colors.textFaint,
  },
});
