import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { PlusIcon } from '@/components/icons';
import { HomeButton } from '@/components/ui/nav-button';
import { PressableCard } from '@/components/ui/card';
import { EmptyState, QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { mockDue } from '@/lib/due-mock';
import { formatMileage } from '@/lib/format';
import { useMyVehicles } from '@/queries/use-vehicles';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';

export default function PersonalGarageScreen() {
  const router = useRouter();
  const vehicles = useMyVehicles();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <HomeButton />
          <Text style={styles.title}>Гараж</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Додати техніку"
          onPress={() => router.push('/personal/new')}
          style={({ pressed }) => [styles.add, pressed && { opacity: 0.85 }]}>
          <PlusIcon color={colors.text} />
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
                const due = mockDue(item);

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
                        {formatMileage(item.mileage, item.mileageUnit)}
                      </Text>
                    </View>

                    {!!last && (
                      <View style={styles.cardFooter}>
                        <Text style={styles.lastLabel} numberOfLines={1}>
                          Останнє: {last.note}
                        </Text>
                        <Text style={styles.lastDate}>{last.date}</Text>
                      </View>
                    )}

                    {!!due && <Text style={styles.due}>● {due}</Text>}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  add: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.fill,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textFaint,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  mileage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: fontFamily.mono,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  lastLabel: {
    flex: 1,
    fontSize: 12,
    color: colors.textMuted,
  },
  lastDate: {
    fontSize: 12,
    color: colors.textFaint,
  },
  due: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '500',
    color: colors.warningOnInk,
  },
});
