import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModeHeader } from '@/components/mode-header';
import { Card } from '@/components/ui/card';
import { BackButton } from '@/components/ui/back-button';
import { QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { SectionTitle } from '@/components/ui/section-title';
import { formatMoney, formatNumber } from '@/lib/format';
import { showPrototypeNotice } from '@/lib/prototype';
import { useMyVehicle } from '@/queries/use-vehicles';
import { LOG_KIND_COLOR } from '@/theme/status';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';

export default function MyVehicleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = useMyVehicle(Number(id));

  return (
    <Screen>
      <ModeHeader title="My Garage" />

      <QueryState query={vehicle}>
        {(item) => {
          const spent = item.log.reduce((sum, entry) => sum + entry.cost, 0);

          return (
            <ScrollView contentContainerStyle={styles.body}>
              <View style={styles.headerRow}>
                <BackButton fallback="/personal" />
              </View>

              <View style={styles.hero}>
                <Text style={styles.heroKicker}>
                  {item.kind.toUpperCase()} · {item.year}
                </Text>
                <Text style={styles.heroTitle}>{item.name}</Text>
                <Text style={styles.heroMileage}>
                  {formatNumber(item.mileage)}
                  <Text style={styles.heroUnit}> {item.unit}</Text>
                </Text>

                {!!item.due && (
                  <View style={styles.dueChip}>
                    <Text style={styles.dueLabel}>⚠ {item.due}</Text>
                  </View>
                )}
              </View>

              <View style={styles.logHead}>
                <SectionTitle>Історія обслуговування</SectionTitle>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => showPrototypeNotice('Новий запис')}
                  style={({ pressed }) => pressed && { opacity: 0.7 }}>
                  <Text style={styles.addEntry}>+ Запис</Text>
                </Pressable>
              </View>

              <View style={styles.timeline}>
                <View style={styles.timelineLine} />

                {item.log.map((entry) => (
                  <View key={entry.id} style={styles.entryRow}>
                    <View
                      style={[styles.entryDot, { backgroundColor: LOG_KIND_COLOR[entry.kind] }]}
                    />

                    <Card style={styles.entryCard}>
                      <View style={styles.entryTop}>
                        <Text style={styles.entryTitle}>{entry.title}</Text>
                        <Text style={styles.entryCost}>{formatMoney(entry.cost)}</Text>
                      </View>

                      {!!entry.note && <Text style={styles.entryNote}>{entry.note}</Text>}

                      <Text style={styles.entryMeta}>
                        {entry.date} · {formatNumber(entry.mileage)} {item.unit}
                      </Text>
                    </Card>
                  </View>
                ))}
              </View>

              <Text style={styles.total}>
                Усього витрачено: <Text style={styles.totalValue}>{formatMoney(spent)}</Text>
              </Text>
            </ScrollView>
          );
        }}
      </QueryState>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  hero: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: radius.xxl,
    backgroundColor: colors.ink,
    padding: spacing.xl,
  },
  heroKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.orange,
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: '700',
    color: colors.cream,
  },
  heroMileage: {
    marginTop: spacing.lg,
    fontSize: 32,
    fontWeight: '700',
    color: colors.cream,
    fontFamily: fontFamily.mono,
  },
  heroUnit: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(237, 232, 223, 0.5)',
    fontFamily: fontFamily.sans,
  },
  dueChip: {
    marginTop: spacing.lg,
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(201, 123, 34, 0.15)',
  },
  dueLabel: {
    fontSize: 12,
    color: colors.amberOnDark,
  },
  logHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  addEntry: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.amber,
  },
  timeline: {
    marginHorizontal: spacing.lg,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    left: 7,
    top: spacing.sm,
    bottom: spacing.sm,
    width: 1,
    backgroundColor: colors.warmBorder,
  },
  entryRow: {
    paddingLeft: 28,
    paddingBottom: spacing.lg,
  },
  entryDot: {
    position: 'absolute',
    left: 0,
    top: spacing.lg,
    width: 15,
    height: 15,
    borderRadius: radius.pill,
    borderWidth: 3,
    borderColor: colors.bg,
  },
  entryCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  entryTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  entryCost: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
  },
  entryNote: {
    marginTop: 2,
    fontSize: 12,
    color: colors.warmBody,
  },
  entryMeta: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.warmMuted,
    fontFamily: fontFamily.mono,
  },
  total: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 12,
    color: colors.warmMuted,
  },
  totalValue: {
    fontWeight: '700',
    color: colors.ink,
  },
});
