import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChevronRightIcon } from '@/components/icons';
import { PressableCard } from '@/components/ui/card';
import { QueryState } from '@/components/ui/query-state';
import { HomeButton } from '@/components/ui/nav-button';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { formatMoney, formatNumber } from '@/lib/format';
import { useFinanceOverview } from '@/queries/use-finance';
import { colors, fontFamily, radius, shadows, spacing } from '@/theme/tokens';
import type { FinancePeriod } from '@/types/domain';

const PERIODS: { label: string; value: FinancePeriod }[] = [
  { label: 'Тиждень', value: 'week' },
  { label: 'Місяць', value: 'month' },
  { label: 'Рік', value: 'year' },
];

export default function MoneyTab() {
  const router = useRouter();
  const [period, setPeriod] = useState<FinancePeriod>('month');
  const overview = useFinanceOverview(period);

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <HomeButton />
        <View>
          <Text style={styles.kicker}>ФІНАНСИ</Text>
          <Text style={styles.title}>Гроші</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.segmented}>
          {PERIODS.map((item) => {
            const active = period === item.value;
            return (
              <Pressable
                key={item.value}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setPeriod(item.value)}
                style={[styles.segment, active && styles.segmentActive]}>
                <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <QueryState query={overview}>
          {({ stats, debtors, totalDebt }) => (
            <>
              <View style={styles.grid}>
                <StatTile label="Зароблено" value={formatMoney(stats.earned)} accent />
                <StatTile label="З робіт" value={formatMoney(stats.works)} />
                <StatTile label="З деталей" value={formatMoney(stats.parts)} />
                <StatTile label="Заїздів" value={formatNumber(stats.visits)} />
              </View>

              <View style={styles.debtHead}>
                <SectionTitle>Борги</SectionTitle>
                <Text style={styles.debtTotal}>{formatMoney(totalDebt)}</Text>
              </View>

              <View style={styles.debtors}>
                {debtors.map((vehicle) => (
                  <PressableCard
                    key={vehicle.id}
                    onPress={() => router.push(`/client-vehicles/${vehicle.id}`)}
                    accessibilityLabel={`${vehicle.plate}, борг ${vehicle.debt}`}
                    style={styles.debtor}>
                    <View style={styles.debtorRow}>
                      <View>
                        <Text style={styles.debtorPlate}>{vehicle.plate}</Text>
                        <Text style={styles.debtorOwner}>{vehicle.owner}</Text>
                      </View>
                      <View style={styles.debtorAmount}>
                        <Text style={styles.debtorValue}>{formatMoney(vehicle.debt)}</Text>
                        <ChevronRightIcon />
                      </View>
                    </View>
                  </PressableCard>
                ))}
              </View>
            </>
          )}
        </QueryState>
      </ScrollView>
    </Screen>
  );
}

interface StatTileProps {
  label: string;
  value: string;
  accent?: boolean;
}

function StatTile({ label, value, accent }: StatTileProps) {
  return (
    <View style={[styles.tile, accent ? styles.tileAccent : styles.tilePlain]}>
      <Text style={[styles.tileLabel, accent && styles.tileLabelAccent]}>{label}</Text>
      <Text style={[styles.tileValue, accent && styles.tileValueAccent]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.textFaint,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.fill,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textFaint,
  },
  segmentLabelActive: {
    color: colors.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.xl,
  },
  tile: {
    flexGrow: 1,
    flexBasis: '47%',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  tilePlain: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  tileAccent: {
    backgroundColor: colors.amber,
  },
  tileLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textFaint,
    marginBottom: 4,
  },
  tileLabelAccent: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  tileValueAccent: {
    color: colors.onAccent,
  },
  debtHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  debtTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dangerOnInk,
  },
  debtors: {
    gap: spacing.sm,
  },
  debtor: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  debtorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtorPlate: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.text,
    fontFamily: fontFamily.mono,
  },
  debtorOwner: {
    fontSize: 12,
    color: colors.textFaint,
  },
  debtorAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  debtorValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.dangerOnInk,
  },
});
