import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MoneyIcon } from '@/components/icons';
import { OrderPhotos } from '@/components/order-photos';
import { StatusPicker } from '@/components/status-picker';
import { BackButton } from '@/components/ui/nav-button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PlateTag } from '@/components/ui/plate-tag';
import { QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatMoney } from '@/lib/format';
import { orderDebt, orderEarnings, orderPaid, orderTotals } from '@/lib/order';
import { showPrototypeNotice } from '@/lib/prototype';
import { useOrderDetail, usePayOrder } from '@/queries/use-orders';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';
import type { ClientVehicle } from '@/types/domain';

const MESSENGERS = ['Viber', 'Telegram', 'SMS'];

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const detail = useOrderDetail(Number(id));
  const [composerOpen, setComposerOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <Screen edges={['top']}>
      <QueryState query={detail}>
        {({ order, vehicle, photos }) => {
          const totals = orderTotals(order);
          const debt = orderDebt(order);
          const earnings = orderEarnings(order);

          return (
            <View style={styles.root}>
              <View style={styles.header}>
                <View style={styles.topRow}>
                  <BackButton fallback={`/client-vehicles/${vehicle.id}`} />
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push(`/orders/edit?orderId=${order.id}`)}
                    style={({ pressed }) => pressed && { opacity: 0.7 }}>
                    <Text style={styles.editOrder}>Змінити</Text>
                  </Pressable>
                </View>
                <View style={styles.headerRow}>
                  <View>
                    <PlateTag plate={vehicle.plate} />
                    <Text style={styles.date}>{order.date}</Text>
                  </View>
                  <StatusBadge status={vehicle.status} />
                </View>
              </View>

              <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.summary}>
                  <Text style={styles.summaryLabel}>Заробіток</Text>
                  <Text style={styles.summaryEarnings}>+{formatMoney(earnings)}</Text>

                  <View style={styles.breakdown}>
                    <Breakdown label="Роботи" value={formatMoney(totals.works)} />
                    <Breakdown label="Деталі" value={formatMoney(totals.parts)} />
                    <Breakdown label="Підсумок" value={formatMoney(totals.total)} />
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
                    <Pressable
                      key={work.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Змінити роботу: ${work.description}`}
                      onPress={() =>
                        router.push(`/orders/work?orderId=${order.id}&workId=${work.id}`)
                      }
                      style={({ pressed }) => [
                        styles.line,
                        index === order.works.length - 1 && styles.lastLine,
                        pressed && { opacity: 0.7 },
                      ]}>
                      <View style={styles.lineMain}>
                        <Text style={styles.lineLabel}>{work.description}</Text>
                        {work.paymentStatus === 'unpaid' && (
                          <Text style={styles.unpaid}>не оплачено</Text>
                        )}
                      </View>
                      <Text style={styles.lineValue}>{formatMoney(work.price)}</Text>
                    </Pressable>
                  ))}

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push(`/orders/work?orderId=${order.id}`)}
                    style={({ pressed }) => [styles.addLine, pressed && { opacity: 0.7 }]}>
                    <Text style={styles.addLineLabel}>+ Робота</Text>
                  </Pressable>
                </Card>

                <Card style={styles.block}>
                  <SectionTitle style={styles.blockTitle}>Запчастини</SectionTitle>
                  {order.parts.length === 0 && <Text style={styles.empty}>Деталей ще немає</Text>}
                  {order.parts.map((part, index) => (
                    <Pressable
                      key={part.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Змінити деталь: ${part.description}`}
                      onPress={() =>
                        router.push(`/orders/part?orderId=${order.id}&partId=${part.id}`)
                      }
                      style={({ pressed }) => [
                        styles.partRow,
                        index === order.parts.length - 1 && styles.lastLine,
                        pressed && { opacity: 0.7 },
                      ]}>
                      <View style={styles.line}>
                        <View style={styles.lineMain}>
                          <Text style={styles.lineLabel}>{part.description}</Text>
                          {part.paymentStatus === 'unpaid' && (
                            <Text style={styles.unpaid}>не оплачено</Text>
                          )}
                        </View>
                        <Text style={styles.lineValue}>{formatMoney(part.sell)}</Text>
                      </View>
                      <View style={styles.partMeta}>
                        <Text style={styles.partBuy}>Закупка: {formatMoney(part.buy)}</Text>
                        <Text style={styles.partProfit}>+{formatMoney(part.sell - part.buy)}</Text>
                      </View>
                    </Pressable>
                  ))}

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push(`/orders/part?orderId=${order.id}`)}
                    style={({ pressed }) => [styles.addLine, pressed && { opacity: 0.7 }]}>
                    <Text style={styles.addLineLabel}>+ Деталь</Text>
                  </Pressable>
                </Card>

                <OrderPhotos orderId={order.id} photos={photos} />

                {composerOpen && <MessageComposer vehicle={vehicle} debt={debt} />}

                <StatusPicker
                  vehicleId={vehicle.id}
                  status={vehicle.status}
                  visible={statusOpen}
                  onClose={() => setStatusOpen(false)}
                />

                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setStatusOpen(true)}
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.neutralButton,
                      pressed && { opacity: 0.8 },
                    ]}>
                    <Text style={styles.neutralLabel}>Статус</Text>
                  </Pressable>

                  <PayButton
                    orderId={order.id}
                    paid={orderPaid(order)}
                    debt={orderDebt(order)}
                  />

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

// Its own component because the mutation hook cannot be called inside
// QueryState's render callback — the same reason StatusPicker takes an id.
function PayButton({ orderId, paid, debt }: { orderId: number; paid: boolean; debt: number }) {
  const pay = usePayOrder(orderId);
  const off = paid || pay.isPending;

  const [asking, setAsking] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={off}
        onPress={() => setAsking(true)}
        style={({ pressed }) => [
          styles.actionButton,
          styles.payButton,
          off && styles.buttonOff,
          pressed && { opacity: 0.8 },
        ]}>
        {pay.isPending ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.primaryLabel}>{paid ? 'Оплачено' : 'Оплата'}</Text>
        )}
      </Pressable>

      <ConfirmDialog
        visible={asking}
        tone="accent"
        icon={<MoneyIcon size={22} color={colors.amberOnDark} />}
        title="Прийняти оплату?"
        body={`${formatMoney(debt)} по цьому наряду стануть оплаченими. Скасувати це в застосунку не можна.`}
        confirmLabel="Прийняти"
        onCancel={() => setAsking(false)}
        onConfirm={() => {
          setAsking(false);
          pay.mutate(undefined, {
            onError: (error) =>
              Alert.alert('Оплата', error instanceof Error ? error.message : 'Не вдалося'),
          });
        }}
      />
    </>
  );
}

function Breakdown({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={styles.breakdownValue}>{value}</Text>
    </View>
  );
}

interface ComposerProps {
  vehicle: ClientVehicle;
  debt: number;
}

function MessageComposer({ vehicle, debt }: ComposerProps) {
  const [message, setMessage] = useState(
    `Добрий день, ${vehicle.owner}!\nВаш ${vehicle.make} ${vehicle.plate} готовий.\nДо сплати: ${formatMoney(
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
  addLine: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  addLineLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editOrder: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.amber,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    padding: spacing.xl,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.orange,
    marginBottom: 6,
  },
  summaryEarnings: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.profit,
    fontFamily: fontFamily.mono,
  },
  breakdown: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  breakdownLabel: {
    fontSize: 10,
    color: colors.textFaint,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textBody,
  },
  debtRow: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtLabel: {
    fontSize: 14,
    color: colors.dangerOnInk,
  },
  debtValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dangerOnInk,
    fontFamily: fontFamily.mono,
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
  lineMain: {
    flex: 1,
    gap: 2,
  },
  unpaid: {
    fontSize: 11,
    color: colors.dangerOnInk,
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
    color: colors.onAccent,
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
  buttonOff: {
    opacity: 0.5,
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
    color: colors.onAccent,
  },
});
