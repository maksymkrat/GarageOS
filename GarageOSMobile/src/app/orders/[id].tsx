import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BackButton } from '@/components/ui/back-button';
import { Card } from '@/components/ui/card';
import { PlateTag } from '@/components/ui/plate-tag';
import { QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatMoney } from '@/lib/format';
import { orderDebt, orderTotals, partsProfit } from '@/lib/order';
import { showPrototypeNotice } from '@/lib/prototype';
import { useOrderDetail } from '@/queries/use-orders';
import { colors, radius, spacing } from '@/theme/tokens';
import type { Car } from '@/types/domain';

const MESSENGERS = ['Viber', 'Telegram', 'SMS'];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useOrderDetail(Number(id));
  const [composerOpen, setComposerOpen] = useState(false);

  return (
    <Screen edges={['top']}>
      <QueryState query={detail}>
        {({ order, car }) => {
          const totals = orderTotals(order);
          const debt = orderDebt(order);
          const profit = partsProfit(order);

          return (
            <View style={styles.root}>
              <View style={styles.header}>
                <BackButton fallback={`/cars/${car.id}`} />
                <View style={styles.headerRow}>
                  <View>
                    <PlateTag plate={car.plate} />
                    <Text style={styles.date}>{order.date}</Text>
                  </View>
                  <StatusBadge status={order.status} />
                </View>
              </View>

              <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.summary}>
                  <Text style={styles.summaryLabel}>Підсумок</Text>
                  <Text style={styles.summaryTotal}>{formatMoney(totals.total)}</Text>

                  <View style={styles.breakdown}>
                    <Breakdown label="Роботи" value={formatMoney(totals.works)} />
                    <Breakdown label="Деталі" value={formatMoney(totals.parts)} />
                    <Breakdown
                      label="Заробіток"
                      value={`+${formatMoney(profit)}`}
                      color={colors.profit}
                    />
                  </View>

                  {debt > 0 && (
                    <View style={styles.debtRow}>
                      <Text style={styles.debtLabel}>Борг клієнта</Text>
                      <Text style={styles.debtValue}>{formatMoney(debt)}</Text>
                    </View>
                  )}
                </View>

                <Card style={styles.block}>
                  <SectionTitle style={styles.blockTitle}>Скарга</SectionTitle>
                  <Text style={styles.complaint}>{order.description}</Text>
                </Card>

                <Card style={styles.block}>
                  <SectionTitle style={styles.blockTitle}>Роботи</SectionTitle>
                  {order.works.length === 0 && <Text style={styles.empty}>Робіт ще немає</Text>}
                  {order.works.map((work, index) => (
                    <View
                      key={work.name}
                      style={[styles.line, index === order.works.length - 1 && styles.lastLine]}>
                      <Text style={styles.lineLabel}>{work.name}</Text>
                      <Text style={styles.lineValue}>{formatMoney(work.price)}</Text>
                    </View>
                  ))}
                </Card>

                <Card style={styles.block}>
                  <SectionTitle style={styles.blockTitle}>Запчастини</SectionTitle>
                  {order.parts.length === 0 && <Text style={styles.empty}>Деталей ще немає</Text>}
                  {order.parts.map((part, index) => (
                    <View
                      key={part.name}
                      style={[styles.partRow, index === order.parts.length - 1 && styles.lastLine]}>
                      <View style={styles.line}>
                        <Text style={styles.lineLabel}>
                          {part.name} ×{part.qty}
                        </Text>
                        <Text style={styles.lineValue}>{formatMoney(part.sell * part.qty)}</Text>
                      </View>
                      <View style={styles.partMeta}>
                        <Text style={styles.partBuy}>
                          Закупка: {formatMoney(part.buy * part.qty)}
                        </Text>
                        <Text style={styles.partProfit}>
                          +{formatMoney((part.sell - part.buy) * part.qty)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </Card>

                {composerOpen && <MessageComposer car={car} debt={debt} />}

                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showPrototypeNotice('Зміна статусу')}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.neutralButton,
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.neutralLabel}>Статус</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showPrototypeNotice('Оплата')}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.payButton,
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.primaryLabel}>Оплата</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setComposerOpen((open) => !open)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.notifyButton,
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.primaryLabel}>Повідомити</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          );
        }}
      </QueryState>
    </Screen>
  );
}

function Breakdown({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={[styles.breakdownValue, !!color && { color }]}>{value}</Text>
    </View>
  );
}

interface ComposerProps {
  car: Car;
  debt: number;
}

function MessageComposer({ car, debt }: ComposerProps) {
  const [message, setMessage] = useState(
    `Добрий день, ${car.owner}!\nВаш ${car.make} ${car.plate} готовий.\nДо сплати: ${formatMoney(
      debt > 0 ? debt : 0
    )}.\nЧекаємо вас!`
  );

  return (
    <View style={styles.composer}>
      <SectionTitle style={styles.composerTitle}>Повідомлення клієнту</SectionTitle>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        style={styles.composerInput}
      />
      <View style={styles.composerActions}>
        {MESSENGERS.map((messenger) => (
          <Pressable
            key={messenger}
            accessibilityRole="button"
            onPress={() => showPrototypeNotice(`Надіслати через ${messenger}`)}
            style={({ pressed }) => [styles.composerButton, pressed && { opacity: 0.85 }]}>
            <Text style={styles.composerButtonLabel}>{messenger}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  date: {
    marginTop: 4,
    fontSize: 11,
    color: colors.textFaint,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  summary: {
    backgroundColor: colors.text,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.surface,
  },
  breakdown: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  breakdownLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  debtRow: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtLabel: {
    fontSize: 14,
    color: '#FCA5A5',
  },
  debtValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.surface,
  },
  block: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  blockTitle: {
    marginBottom: 10,
  },
  complaint: {
    fontSize: 14,
    color: colors.textBody,
  },
  empty: {
    fontSize: 13,
    color: colors.textFaint,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  lastLine: {
    borderBottomWidth: 0,
  },
  lineLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textBody,
  },
  lineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  partRow: {
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  partMeta: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: 6,
  },
  partBuy: {
    fontSize: 10,
    color: colors.textFaint,
  },
  partProfit: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.profit,
  },
  composer: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.successBorder,
    backgroundColor: colors.successSurface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  composerTitle: {
    color: colors.success,
    marginBottom: spacing.sm,
  },
  composerInput: {
    fontSize: 14,
    color: colors.textBody,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  composerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  composerButton: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  composerButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.surface,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  neutralButton: {
    backgroundColor: colors.fill,
  },
  payButton: {
    backgroundColor: colors.amber,
  },
  notifyButton: {
    backgroundColor: colors.blueDark,
  },
  neutralLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBody,
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
});
