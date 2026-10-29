import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { clientVehiclePhotoSource } from '@/api/client-vehicles';
import { PressableCard } from '@/components/ui/card';
import { EmptyState, QueryState } from '@/components/ui/query-state';
import { HomeButton } from '@/components/ui/nav-button';
import { Screen } from '@/components/ui/screen';
import { VehicleImage } from '@/components/ui/vehicle-image';
import { useWorkBoard, type WorkBoardRow } from '@/queries/use-work-board';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';
import type { ClientVehicleStatus } from '@/types/domain';

// The board holds what still waits for the master's hands, so `ready` is not
// here: it is the terminal state and a finished car leaves the board for the
// card index, where the «Готові» filter finds it (ADR-0031).
const GROUPS: { status: ClientVehicleStatus; title: string; color: string }[] = [
  { status: 'waiting_part', title: 'Чекає деталь', color: colors.warning },
  { status: 'in_work', title: 'В роботі', color: colors.blue },
  { status: 'has_debt', title: 'Чекаю оплату', color: colors.danger },
];

const LATE_THRESHOLD_DAYS = 5;

export default function WorkTab() {
  const board = useWorkBoard();

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <HomeButton />
        <View>
          <Text style={styles.kicker}>ПОТОЧНИЙ СТАН</Text>
          <Text style={styles.title}>В роботі</Text>
        </View>
      </View>

      <QueryState query={{ ...board, data: board.rowsByStatus }}>
        {(rowsByStatus) => {
          const groups = GROUPS.map((group) => ({
            ...group,
            rows: rowsByStatus[group.status] ?? [],
          })).filter((group) => group.rows.length > 0);

          if (groups.length === 0) return <EmptyState text="Немає авто в роботі" />;

          return (
            <ScrollView contentContainerStyle={styles.body}>
              {groups.map((group) => (
                <View key={group.status} style={styles.group}>
                  <View style={styles.groupHead}>
                    <View style={[styles.dot, { backgroundColor: group.color }]} />
                    <Text style={styles.groupTitle}>{group.title.toUpperCase()}</Text>
                    <View style={styles.count}>
                      <Text style={styles.countLabel}>{group.rows.length}</Text>
                    </View>
                  </View>

                  <View style={styles.rows}>
                    {group.rows.map((row) => (
                      <WorkRow key={row.vehicle.id} row={row} />
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          );
        }}
      </QueryState>
    </Screen>
  );
}

function WorkRow({ row }: { row: WorkBoardRow }) {
  const router = useRouter();
  const late = row.daysWaiting >= LATE_THRESHOLD_DAYS;

  return (
    <PressableCard
      onPress={() => router.push(`/client-vehicles/${row.vehicle.id}`)}
      accessibilityLabel={row.vehicle.plate}
      style={styles.row}>
      <View style={styles.rowInner}>
        {/* Always a slot, photo or not — same rule as the card in the garage:
            a row that changes shape with the picture reads as a glitch. */}
        <VehicleImage
          source={
            row.vehicle.photoId === undefined
              ? null
              : clientVehiclePhotoSource(row.vehicle.id, row.vehicle.photoId, 'thumb')
          }
          glyph={30}
          style={styles.photo}
        />

        <View style={styles.rowMain}>
          <Text style={styles.plate}>{row.vehicle.plate}</Text>
          <Text style={styles.meta}>
            {row.vehicle.make} {row.vehicle.model} · {row.vehicle.owner}
          </Text>
          {!!row.description && (
            <Text style={styles.description} numberOfLines={1}>
              {row.description}
            </Text>
          )}
        </View>

        {row.daysWaiting > 0 && (
          <View style={styles.days}>
            <Text style={[styles.daysValue, late && styles.late]}>{row.daysWaiting}</Text>
            <Text style={[styles.daysLabel, late && styles.late]}>днів</Text>
          </View>
        )}
      </View>
    </PressableCard>
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
    paddingBottom: spacing.lg,
  },
  group: {
    marginBottom: spacing.xl,
  },
  groupHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: colors.textMuted,
  },
  count: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
  },
  countLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textFaint,
  },
  rows: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  row: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  // The thumb rendition, as everywhere a list shows cars (ADR-0026).
  photo: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.fill,
  },
  rowMain: {
    flex: 1,
  },
  plate: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.text,
    fontFamily: fontFamily.mono,
  },
  meta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  description: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textFaint,
  },
  days: {
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  daysValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textFaint,
  },
  daysLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textFaint,
  },
  late: {
    color: colors.dangerOnInk,
  },
});
