import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { FormScreen } from '@/components/forms/form-screen';
import { ChipRow } from '@/components/ui/chip-row';
import { DangerButton } from '@/components/ui/danger-button';
import { QueryState } from '@/components/ui/query-state';
import { TextField } from '@/components/ui/text-field';
import { formatMoney, parseMoney } from '@/lib/format';
import { useDeleteOrderPart, useOrderDetail, useSaveOrderPart } from '@/queries/use-orders';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { PaymentStatus } from '@/types/domain';

const PAYMENT_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'unpaid', label: 'Не оплачено' },
  { value: 'paid', label: 'Оплачено' },
];

export default function OrderPartScreen() {
  const router = useRouter();
  const { orderId, partId } = useLocalSearchParams<{ orderId: string; partId?: string }>();
  const order = Number(orderId);
  const id = partId === undefined ? undefined : Number(partId);

  const detail = useOrderDetail(order);
  const save = useSaveOrderPart(order, id);
  const remove = useDeleteOrderPart(order, id ?? 0);

  return (
    <QueryState query={detail}>
      {({ order: current, vehicle }) => {
        const existing = id === undefined ? undefined : current.parts.find((p) => p.id === id);

        if (id !== undefined && existing === undefined) {
          return (
            <FormScreen back={`/orders/${order}`} title="Деталь не знайдено">
              <Text style={styles.missing}>Цього рядка вже немає — можливо, його видалено.</Text>
            </FormScreen>
          );
        }

        return (
          <FormScreen
            back={`/orders/${order}`}
            title={existing === undefined ? 'Нова деталь' : 'Змінити деталь'}
            subtitle={`${vehicle.plate} · наряд від ${current.date}`}>
            <PartFields
              key={existing?.id ?? 'new'}
              initialDescription={existing?.description ?? ''}
              initialBuy={existing === undefined ? '' : String(existing.buy).replace('.', ',')}
              initialSell={existing === undefined ? '' : String(existing.sell).replace('.', ',')}
              initialPayment={existing?.paymentStatus ?? 'unpaid'}
              pending={save.isPending}
              error={save.error ?? remove.error}
              onSubmit={(values) => save.mutate(values, { onSuccess: () => router.back() })}
            />

            {existing !== undefined && (
              <DangerButton
                label="Видалити деталь"
                confirmTitle="Видалити деталь?"
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

interface PartFieldsProps {
  initialDescription: string;
  initialBuy: string;
  initialSell: string;
  initialPayment: PaymentStatus;
  pending: boolean;
  error: unknown;
  onSubmit: (values: {
    description: string;
    buy: number;
    sell: number;
    paymentStatus: PaymentStatus;
  }) => void;
}

function PartFields({
  initialDescription,
  initialBuy,
  initialSell,
  initialPayment,
  pending,
  error,
  onSubmit,
}: PartFieldsProps) {
  const [description, setDescription] = useState(initialDescription);
  const [buy, setBuy] = useState(initialBuy);
  const [sell, setSell] = useState(initialSell);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(initialPayment);
  const [errors, setErrors] = useState<{ description?: string; buy?: string; sell?: string }>({});

  const profit = (parseMoney(sell) ?? 0) - (parseMoney(buy) ?? 0);

  function submit() {
    const found: { description?: string; buy?: string; sell?: string } = {};
    if (!description.trim()) found.description = 'Вкажіть назву деталі';
    if (parseMoney(buy) === null) found.buy = 'Вкажіть закупку';
    if (parseMoney(sell) === null) found.sell = 'Вкажіть продаж';

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      description: description.trim(),
      buy: parseMoney(buy) ?? 0,
      sell: parseMoney(sell) ?? 0,
      paymentStatus,
    });
  }

  return (
    <>
      <TextField
        label="Назва *"
        placeholder="Колодки передні Akebono"
        value={description}
        onChangeText={setDescription}
        error={errors.description}
      />

      <TextField
        label="Закупка, ₴ *"
        placeholder="900"
        keyboardType="decimal-pad"
        value={buy}
        onChangeText={setBuy}
        error={errors.buy}
      />

      <TextField
        label="Продаж, ₴ *"
        placeholder="1 350"
        keyboardType="decimal-pad"
        value={sell}
        onChangeText={setSell}
        error={errors.sell}
      />

      <Text style={styles.profit}>Заробіток: {formatMoney(profit)}</Text>

      <ChipRow
        label="Оплата"
        options={PAYMENT_OPTIONS}
        value={paymentStatus}
        onChange={setPaymentStatus}
      />

      {!!error && (
        <Text style={styles.error}>
          {error instanceof Error ? error.message : 'Не вдалося зберегти деталь'}
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
          <Text style={styles.submitLabel}>Зберегти деталь</Text>
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
  profit: {
    marginTop: -spacing.sm,
    fontSize: 12,
    color: colors.profit,
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
