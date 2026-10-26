import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { clientVehiclePhotoSource } from '@/api/client-vehicles';
import { CameraIcon, CarGlyph, ChevronRightIcon, MessageIcon, PhoneIcon, PlusIcon } from '@/components/icons';
import { BackButton } from '@/components/ui/back-button';
import { Card, PressableCard } from '@/components/ui/card';
import { PickerDialog } from '@/components/ui/picker-dialog';
import { QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { StatusPicker } from '@/components/status-picker';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatMileage, formatMoney, formatPhone } from '@/lib/format';
import { orderPaid, orderTotals } from '@/lib/order';
import { showPrototypeNotice } from '@/lib/prototype';
import { usePhotoActions, type PhotoAction } from '@/hooks/use-photo-actions';
import {
  useClientVehicleDetail,
  useDeleteClientVehiclePhoto,
  usePayClientVehicle,
  useSetClientVehiclePhoto,
} from '@/queries/use-client-vehicles';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';
import type { ClientVehicle } from '@/types/domain';

const HEADER_HEIGHT = 200;

export default function ClientVehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const detail = useClientVehicleDetail(Number(id));
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <Screen background={colors.bg} edges={['top']}>
      <QueryState query={detail}>
        {({ vehicle, orders, sameOwnerCount }) => (
          <View style={styles.root}>
            <View style={styles.header}>
              <VehiclePhoto vehicle={vehicle} />

              {vehicle.photoId === undefined && (
                <View style={styles.watermark}>
                  <CarGlyph size={120} />
                </View>
              )}

              <View style={styles.headerTop}>
                <BackButton fallback="/garage" color={colors.amberOnDark} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Змінити стан авто"
                  hitSlop={8}
                  onPress={() => setStatusOpen(true)}
                  style={({ pressed }) => pressed && { opacity: 0.7 }}>
                  <StatusBadge status={vehicle.status} />
                </Pressable>

                <StatusPicker
                  vehicleId={vehicle.id}
                  status={vehicle.status}
                  visible={statusOpen}
                  onClose={() => setStatusOpen(false)}
                />
              </View>

              <View style={styles.headerBottom}>
                <Text style={styles.plate}>{vehicle.plate}</Text>
                <Text style={styles.model}>
                  {vehicle.make} {vehicle.model}
                  {vehicle.year === undefined ? '' : `, ${vehicle.year}`}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
              <View style={styles.quickActions}>
                <QuickAction
                  label="Подзвонити"
                  background={colors.successBg}
                  color={colors.success}
                  onPress={() => Linking.openURL(`tel:${vehicle.phone}`)}
                  icon={<PhoneIcon size={16} color={colors.success} />}
                />
                <QuickAction
                  label="Написати"
                  background={colors.blueBg}
                  color={colors.blue}
                  onPress={() => Linking.openURL(`sms:${vehicle.phone}`)}
                  icon={<MessageIcon size={16} color={colors.blue} />}
                />
                <QuickAction
                  label="Новий наряд"
                  background={colors.warningBg}
                  color={colors.amber}
                  onPress={() => router.push(`/orders/new?vehicleId=${vehicle.id}`)}
                  icon={<PlusIcon size={16} color={colors.amber} />}
                />
              </View>

              {vehicle.debt > 0 && (
                <View style={styles.debtBanner}>
                  <View>
                    <Text style={styles.debtLabel}>Борг</Text>
                    <Text style={styles.debtValue}>{formatMoney(vehicle.debt)}</Text>
                  </View>
                  <AcceptPaymentButton vehicleId={vehicle.id} />
                </View>
              )}

              <Card style={styles.summaryCard}>
                <View style={styles.summaryInner}>
                  <SectionTitle style={styles.summaryTitle}>Зведення</SectionTitle>
                  <SummaryRows vehicle={vehicle} />
                </View>

                {sameOwnerCount > 0 && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showPrototypeNotice('Авто власника')}
                    style={({ pressed }) => [styles.ownerLink, pressed && { opacity: 0.7 }]}>
                    <Text style={styles.ownerLinkLabel}>
                      Ще {sameOwnerCount} авто цього власника
                    </Text>
                    <ChevronRightIcon size={14} color={colors.amber} />
                  </Pressable>
                )}
              </Card>

              {orders.length > 0 && (
                <View style={styles.ordersBlock}>
                  <SectionTitle style={styles.ordersTitle}>Історія нарядів</SectionTitle>

                  <View style={styles.orders}>
                    {orders.map((order) => {
                      const { total } = orderTotals(order);
                      const paid = orderPaid(order);
                      const hasLines = order.works.length + order.parts.length > 0;

                      return (
                        <PressableCard
                          key={order.id}
                          onPress={() => router.push(`/orders/${order.id}`)}
                          accessibilityLabel={`Наряд ${order.date}`}
                          style={styles.orderCard}>
                          <View style={styles.orderRow}>
                            <View style={styles.orderMain}>
                              <Text style={styles.orderDate}>{order.date}</Text>
                              <Text style={styles.orderWorks} numberOfLines={1}>
                                {order.works.map((work) => work.description).join(', ') || 'Без робіт'}
                              </Text>
                            </View>

                            <View style={styles.orderSide}>
                              <Text style={styles.orderTotal}>{formatMoney(total)}</Text>
                              {hasLines && (
                                <Text style={paid ? styles.orderPaid : styles.orderUnpaid}>
                                  {paid ? 'оплачено' : 'не оплачено'}
                                </Text>
                              )}
                            </View>
                          </View>
                        </PressableCard>
                      );
                    })}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </QueryState>
    </Screen>
  );
}

// Lives in the header: the photo is the header's background and the camera
// button sits in its corner, so adding and seeing a photo are the same place.
// Its own component for the usual reason — the mutation hooks cannot be called
// inside QueryState's render callback.
function VehiclePhoto({ vehicle }: { vehicle: ClientVehicle }) {
  const save = useSetClientVehiclePhoto(vehicle.id);
  const remove = useDeleteClientVehiclePhoto(vehicle.id);

  const photo = usePhotoActions(
    save.mutateAsync,
    vehicle.photoId === undefined ? null : remove.mutateAsync
  );

  return (
    <>
      {vehicle.photoId !== undefined && (
        <>
          <Image
            // The URL carries the photo id, so a replacement is a different URL
            // and the cached copy cannot linger.
            source={clientVehiclePhotoSource(vehicle.id, vehicle.photoId, 'full')}
            contentFit="cover"
            // No fade here either, for the reason spelled out in VehicleImage:
            // a picture that loads while this screen is not on top would stay
            // at alpha 0 waiting for an animation that never runs.
            cachePolicy="memory-disk"
            style={styles.headerPhoto}
          />
          {/* The plate and the status badge have to stay readable over any
              picture, so they sit on a scrim rather than straight on it. */}
          <View style={styles.headerScrim} />
        </>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={vehicle.photoId === undefined ? 'Додати фото' : 'Змінити фото'}
        disabled={photo.busy}
        hitSlop={8}
        onPress={photo.start}
        style={({ pressed }) => [styles.photoButton, (pressed || photo.busy) && { opacity: 0.7 }]}>
        {photo.busy ? (
          <ActivityIndicator size="small" color={colors.cream} />
        ) : (
          <CameraIcon size={18} color={colors.cream} />
        )}
      </Pressable>

      <PickerDialog
        visible={photo.open}
        title="Фото авто"
        options={photo.options}
        // Nothing is ever selected here: this is a list of actions, not a choice
        // of state, and PickerDialog highlights only a matching value.
        value={'' as PhotoAction}
        busy={photo.busy}
        onPick={photo.run}
        onCancel={photo.close}
      />
    </>
  );
}

// Its own component because the mutation hook cannot be called inside
// QueryState's render callback — the same reason StatusPicker takes an id.
function AcceptPaymentButton({ vehicleId }: { vehicleId: number }) {
  const pay = usePayClientVehicle(vehicleId);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={pay.isPending}
      onPress={() =>
        pay.mutate(undefined, {
          onError: (error) =>
            Alert.alert('Оплата', error instanceof Error ? error.message : 'Не вдалося'),
        })
      }
      style={({ pressed }) => [
        styles.debtButton,
        (pressed || pay.isPending) && { opacity: 0.85 },
      ]}>
      {pay.isPending ? (
        <ActivityIndicator color={colors.onAccent} />
      ) : (
        <Text style={styles.debtButtonLabel}>Прийняти оплату</Text>
      )}
    </Pressable>
  );
}

function SummaryRows({ vehicle }: { vehicle: ClientVehicle }) {
  const rows: [string, string][] = [
    ['Власник', vehicle.owner],
    ['Телефон', formatPhone(vehicle.phone)],
  ];

  if (vehicle.mileage !== undefined) {
    rows.push(['Пробіг', formatMileage(vehicle.mileage, vehicle.mileageUnit)]);
  }

  rows.push(['Останній заїзд', vehicle.lastVisit]);

  if (vehicle.nextService) rows.push(['Наступне ТО', vehicle.nextService]);

  return (
    <>
      {rows.map(([label, value], index) => (
        <View key={label} style={[styles.summaryRow, index === rows.length - 1 && styles.lastRow]}>
          <Text style={styles.summaryLabel}>{label}</Text>
          <Text style={styles.summaryValue}>{value}</Text>
        </View>
      ))}
    </>
  );
}

interface QuickActionProps {
  label: string;
  background: string;
  color: string;
  icon: ReactNode;
  onPress: () => void;
}

function QuickAction({ label, background, color, icon, onPress }: QuickActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        { backgroundColor: background },
        pressed && { opacity: 0.75 },
      ]}>
      {icon}
      <Text style={[styles.quickLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: colors.surface,
  },
  watermark: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  headerBottom: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
  },
  plate: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: colors.onAccent,
    fontFamily: fontFamily.mono,
  },
  model: {
    marginTop: 2,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  body: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  bodyContent: {
    paddingBottom: spacing.xxl,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  quickAction: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  debtBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtLabel: {
    fontSize: 12,
    color: colors.textFaint,
  },
  debtValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.dangerOnInk,
  },
  debtButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  debtButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.onAccent,
  },
  summaryCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
  },
  summaryInner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  summaryTitle: {
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textFaint,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textBody,
  },
  ownerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  ownerLinkLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.amber,
  },
  ordersBlock: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  ordersTitle: {
    marginBottom: 10,
  },
  orders: {
    gap: spacing.sm,
  },
  orderCard: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  orderMain: {
    flex: 1,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textFaint,
  },
  orderWorks: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textBody,
  },
  orderSide: {
    marginLeft: spacing.md,
    alignItems: 'flex-end',
    gap: 2,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  orderPaid: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.successOnInk,
  },
  orderUnpaid: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.dangerOnInk,
  },
  // The stored photo is square (ADR-0026) and the header is wide, so `cover`
  // crops the top and bottom. That is the trade for a full-bleed header.
  headerPhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 23, 20, 0.45)',
  },
  photoButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 23, 20, 0.55)',
    borderWidth: 1,
    borderColor: colors.border,
    // Above the plate block, which is absolutely positioned in the same corner
    // region and painted later.
    zIndex: 2,
  },
});
