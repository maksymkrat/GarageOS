import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CameraIcon, CarGlyph, ChevronRightIcon, MessageIcon, PhoneIcon, PlusIcon } from '@/components/icons';
import { BackButton } from '@/components/ui/back-button';
import { Card, PressableCard } from '@/components/ui/card';
import { QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatMileage, formatMoney, formatPhone } from '@/lib/format';
import { orderDebt, orderTotals } from '@/lib/order';
import { showPrototypeNotice } from '@/lib/prototype';
import { useCarDetail } from '@/queries/use-cars';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';
import type { Car } from '@/types/domain';

const HEADER_HEIGHT = 200;

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const detail = useCarDetail(Number(id));

  return (
    <Screen background={colors.inkSoft} edges={['top']}>
      <QueryState query={detail}>
        {({ car, orders, sameOwnerCount }) => (
          <View style={styles.root}>
            <View style={styles.header}>
              <View style={styles.watermark}>
                <CarGlyph size={120} />
              </View>

              <View style={styles.headerTop}>
                <BackButton fallback="/garage" color={colors.amberOnDark} />
                <StatusBadge status={car.status} />
              </View>

              <View style={styles.headerBottom}>
                <Text style={styles.plate}>{car.plate}</Text>
                <Text style={styles.model}>
                  {car.make} {car.model}, {car.year}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
              <View style={styles.quickActions}>
                <QuickAction
                  label="Подзвонити"
                  background={colors.successBg}
                  color={colors.success}
                  onPress={() => Linking.openURL(`tel:${car.phone}`)}
                  icon={<PhoneIcon size={16} color={colors.success} />}
                />
                <QuickAction
                  label="Написати"
                  background={colors.blueBg}
                  color={colors.blue}
                  onPress={() => Linking.openURL(`sms:${car.phone}`)}
                  icon={<MessageIcon size={16} color={colors.blue} />}
                />
                <QuickAction
                  label="Новий наряд"
                  background={colors.warningBg}
                  color={colors.amber}
                  onPress={() => showPrototypeNotice('Новий наряд')}
                  icon={<PlusIcon size={16} color={colors.amber} />}
                />
              </View>

              {car.debt > 0 && (
                <View style={styles.debtBanner}>
                  <View>
                    <Text style={styles.debtLabel}>Борг</Text>
                    <Text style={styles.debtValue}>{formatMoney(car.debt)}</Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => showPrototypeNotice('Прийняти оплату')}
                    style={({ pressed }) => [styles.debtButton, pressed && { opacity: 0.85 }]}>
                    <Text style={styles.debtButtonLabel}>Прийняти оплату</Text>
                  </Pressable>
                </View>
              )}

              <Card style={styles.summaryCard}>
                <View style={styles.summaryInner}>
                  <SectionTitle style={styles.summaryTitle}>Зведення</SectionTitle>
                  <SummaryRows car={car} />
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
                      const debt = orderDebt(order);

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
                                {order.works.map((work) => work.name).join(', ') || 'Без робіт'}
                              </Text>
                            </View>

                            <View style={styles.orderSide}>
                              <Text style={styles.orderTotal}>{formatMoney(total)}</Text>
                              {debt > 0 && (
                                <Text style={styles.orderDebt}>−{formatMoney(debt)}</Text>
                              )}
                              <StatusBadge status={order.status} />
                            </View>
                          </View>
                        </PressableCard>
                      );
                    })}
                  </View>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={() => showPrototypeNotice('Фото авто')}
                style={({ pressed }) => [styles.photoButton, pressed && { opacity: 0.7 }]}>
                <CameraIcon size={20} />
                <Text style={styles.photoLabel}>Додати фото</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </QueryState>
    </Screen>
  );
}

function SummaryRows({ car }: { car: Car }) {
  const rows: [string, string][] = [
    ['Власник', car.owner],
    ['Телефон', formatPhone(car.phone)],
    ['Пробіг', formatMileage(car.mileage)],
    ['Останній заїзд', car.lastVisit],
  ];

  if (car.nextService) rows.push(['Наступне ТО', car.nextService]);

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
    backgroundColor: colors.inkSoft,
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
    color: colors.surface,
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
    color: colors.dangerDark,
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
    color: colors.surface,
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
  orderDebt: {
    fontSize: 12,
    color: colors.dangerDark,
  },
  photoButton: {
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.placeholder,
    alignItems: 'center',
    gap: 6,
  },
  photoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textFaint,
  },
});
