import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { PlusIcon } from '@/components/icons';
import { ModeHeader } from '@/components/mode-header';
import { PressableCard } from '@/components/ui/card';
import { EmptyState, QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { formatMileage } from '@/lib/format';
import { showPrototypeNotice } from '@/lib/prototype';
import { useMyVehicles } from '@/queries/use-vehicles';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';

export default function PersonalGarageScreen() {
  const router = useRouter();
  const vehicles = useMyVehicles();

  return (
    <Screen edges={['top', 'bottom']}>
      <ModeHeader title="My Garage" />

      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>MY GARAGE</Text>
          <Text style={styles.title}>Моя техніка</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Додати техніку"
          onPress={() => showPrototypeNotice('Додати техніку')}
          style={({ pressed }) => [styles.add, pressed && { opacity: 0.85 }]}>
          <PlusIcon color={colors.cream} />
        </Pressable>
      </View>

      <QueryState query={vehicles}>
        {(items) =>
          items.length === 0 ? (
            <EmptyState text="Техніки ще немає" />
          ) : (
            <FlatList
              data={items}
              keyExtractor={(vehicle) => String(vehicle.id)}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const last = item.log[0];

                return (
                  <PressableCard
                    onPress={() => router.push(`/personal/${item.id}`)}
                    accessibilityLabel={item.name}
                    style={styles.card}>
                    <View style={styles.cardTop}>
                      <View>
                        <Text style={styles.cardKicker}>
                          {item.kind} · {item.year}
                        </Text>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                      </View>
                      <Text style={styles.mileage}>
                        {formatMileage(item.mileage, item.unit)}
                      </Text>
                    </View>

                    {!!last && (
                      <View style={styles.cardFooter}>
                        <Text style={styles.lastLabel} numberOfLines={1}>
                          Останнє: {last.title}
                        </Text>
                        <Text style={styles.lastDate}>{last.date}</Text>
                      </View>
                    )}

                    {!!item.due && <Text style={styles.due}>● {item.due}</Text>}
                  </PressableCard>
                );
              }}
            />
          )
        }
      </QueryState>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.warmMuted,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
  },
  add: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardKicker: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.warmMuted,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
  },
  mileage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    fontFamily: fontFamily.mono,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.warmDivider,
  },
  lastLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.warmBody,
  },
  lastDate: {
    fontSize: 12,
    color: colors.warmMuted,
  },
  due: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '500',
    color: colors.amber,
  },
});
