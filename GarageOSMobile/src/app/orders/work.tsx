import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { FormScreen } from '@/components/forms/form-screen';
import { ChipRow } from '@/components/ui/chip-row';
import { DangerButton } from '@/components/ui/danger-button';
import { QueryState } from '@/components/ui/query-state';
import { TextField } from '@/components/ui/text-field';
import { parseMoney } from '@/lib/format';
import { useDeleteOrderWork, useOrderDetail, useSaveOrderWork } from '@/queries/use-orders';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { PaymentStatus } from '@/types/domain';

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'unpaid', label: 'Не оплачено' },
  { value: 'paid', label: 'Оплачено' },
];

export default function OrderWorkScreen() {
  const router = useRouter();
  const { orderId, workId } = useLocalSearchParams<{ orderId: string; workId?: string }>();
  const order = Number(orderId);
  const id = workId === undefined ? undefined : Number(workId);

  const detail = useOrderDetail(order);
  const save = useSaveOrderWork(order, id);
  const remove = useDeleteOrderWork(order, id ?? 0);

  return (
    <QueryState query={detail}>
      {({ order: current, vehicle }) => {
        const existing = id === undefined ? undefined : current.works.find((w) => w.id === id);

        if (id !== undefined && existing === undefined) {
          return (
            <FormScreen back={`/orders/${order}`} title="Роботу не знайдено">
              <Text style={styles.missing}>Цього рядка вже немає — можливо, його видалено.</Text>
            </FormScreen>
          );
        }

        return (
          <FormScreen
            back={`/orders/${order}`}
            title={existing === undefined ? 'Нова робота' : 'Змінити роботу'}
            subtitle={`${vehicle.plate} · наряд від ${current.date}`}>
            <WorkFields
              key={existing?.id ?? 'new'}
              initialDescription={existing?.description ?? ''}
              initialPrice={existing === undefined ? '' : String(existing.price).replace('.', ',')}
              initialPayment={existing?.paymentStatus ?? 'unpaid'}
              pending={save.isPending}
              error={save.error ?? remove.error}
              onSubmit={(values) => save.mutate(values, { onSuccess: () => router.back() })}
            />

            {existing !== undefined && (
              <DangerButton
                label="Видалити роботу"
                confirmTitle="Видалити роботу?"
                confirmBody={`«${existing.description}» зникне з наряду, і борг клієнта перерахується.`}
                pending={remove.isPending}
                onConfirm={() => remove.mutate(undefined, { onSuccess: () => router.back() })}
              />
            )}
          </FormScreen>
        );
      }}
    </QueryState>
  );
}

interface WorkFieldsProps {
  initialDescription: string;
  initialPrice: string;
  initialPayment: PaymentStatus;
  pending: boolean;
  error: unknown;
  onSubmit: (values: { description: string; price: number; paymentStatus: PaymentStatus }) => void;
}

function WorkFields({
  initialDescription,
  initialPrice,
  initialPayment,
  pending,
  error,
  onSubmit,
}: WorkFieldsProps) {
  const [description, setDescription] = useState(initialDescription);
  const [price, setPrice] = useState(initialPrice);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initialPayment);
  const [errors, setErrors] = useState<{ description?: string; price?: string }>({});

  function submit() {
    const found: { description?: string; price?: string } = {};
    if (!description.trim()) found.description = 'Вкажіть, що зроблено';
    if (parseMoney(price) === null) found.price = 'Вкажіть ціну, напр. 1250 або 1250,50';

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      description: description.trim(),
      price: parseMoney(price) ?? 0,
      paymentStatus,
    });
  }

  return (
    <>
      <TextField
        label="Що зроблено *"
        placeholder="Заміна гальмівних колодок"
        value={description}
        onChangeText={setDescription}
        error={errors.description}
      />

      <TextField
        label="Ціна, ₴ *"
        placeholder="1 200"
        keyboardType="decimal-pad"
        value={price}
        onChangeText={setPrice}
        error={errors.price}
      />

      <ChipRow
        label="Оплата"
        options={PAYMENT_OPTIONS}
        value={paymentStatus}
        onChange={setPaymentStatus}
      />

      {!!error && (
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'Не вдалося зберегти роботу'}
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
          <Text style={styles.submitLabel}>Зберегти роботу</Text>
        )}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  missing: {
    fontSize: 13,
    color: colors.textMuted,
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
