import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { FormScreen } from '@/components/forms/form-screen';
import { OrderPhotos } from '@/components/order-photos';
import { DangerButton } from '@/components/ui/danger-button';
import { QueryState } from '@/components/ui/query-state';
import { TextArea } from '@/components/ui/text-area';
import { useDeleteOrder, useOrderDetail, useUpdateOrder } from '@/queries/use-orders';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

export default function EditOrderScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const id = Number(orderId);

  const detail = useOrderDetail(id);
  const updateOrder = useUpdateOrder(id);
  const deleteOrder = useDeleteOrder(id);

  return (
    <QueryState query={detail}>
      {({ order, vehicle, photos }) => {
        const lineCount = order.works.length + order.parts.length;

        return (
          <FormScreen
            back={`/orders/${id}`}
            title="Змінити наряд"
            subtitle={`${vehicle.plate} · від ${order.date}`}>
            <ComplaintForm
              initial={order.description}
              pending={updateOrder.isPending}
              error={updateOrder.error ?? deleteOrder.error}
              onSubmit={(description) =>
                updateOrder.mutate({ description }, { onSuccess: () => router.back() })
              }
            />

            <OrderPhotos orderId={id} photos={photos} />

            <Text style={styles.note}>
              Роботи й деталі редагуються кожна окремо — дотиком по рядку на екрані
              наряду
            </Text>

            <DangerButton
              label="Видалити наряд"
              confirmTitle="Видалити наряд?"
              confirmBody={
                lineCount === 0
                  ? `Наряд від ${order.date} буде видалено назавжди.`
                  : `Наряд від ${order.date} зникне разом із ${lineCount} ${lineWord(lineCount)}. Борг клієнта перерахується. Це не скасувати.`
              }
              pending={deleteOrder.isPending}
              onConfirm={() =>
                deleteOrder.mutate(undefined, {
                  onSuccess: () => router.replace(`/client-vehicles/${vehicle.id}`),
                })
              }
            />
          </FormScreen>
        );
      }}
    </QueryState>
  );
}

interface ComplaintFormProps {
  initial: string;
  pending: boolean;
  error: unknown;
  onSubmit: (description: string) => void;
}

function ComplaintForm({ initial, pending, error, onSubmit }: ComplaintFormProps) {
  const [description, setDescription] = useState(initial);
  const [invalid, setInvalid] = useState(false);

  function submit() {
    if (!description.trim()) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    onSubmit(description.trim());
  }

  return (
    <>
      <TextArea
        label="Скарга / що з машиною *"
        placeholder="Стукіт при гальмуванні, тече масло…"
        value={description}
        onChangeText={setDescription}
        error={invalid ? 'Опишіть, з чим приїхало авто' : undefined}
      />

      {!!error && (
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'Не вдалося зберегти наряд'}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={pending}
        onPress={submit}
        style={({ pressed }) => [styles.submit, (pressed || pending) && { opacity: 0.85 }]}>
        {pending ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.submitLabel}>Зберегти зміни</Text>
        )}
      </Pressable>
    </>
  );
}

function lineWord(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'рядком';

  return 'рядками';
}

const styles = StyleSheet.create({
  note: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.textFaint,
  },
  error: {
    fontSize: 13,
    color: colors.dangerOnInk,
  },
  submit: {
    backgroundColor: colors.amber,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.submit,
  },
  submitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onAccent,
  },
});
