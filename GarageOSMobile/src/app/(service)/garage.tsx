import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CarCard } from '@/components/car-card';
import { PlusIcon, SearchIcon } from '@/components/icons';
import { LogoMark } from '@/components/logo-mark';
import { ModeHeader } from '@/components/mode-header';
import { EmptyState, QueryState } from '@/components/ui/query-state';
import { Screen } from '@/components/ui/screen';
import { useCars } from '@/queries/use-cars';
import { colors, radius, shadows, spacing } from '@/theme/tokens';
import type { Car, CarStatus } from '@/types/domain';

type Filter = 'all' | CarStatus | 'debt';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'Усі', value: 'all' },
  { label: 'В роботі', value: 'in_work' },
  { label: 'Чекає деталь', value: 'waiting_part' },
  { label: 'Готові', value: 'ready' },
  { label: 'З боргом', value: 'debt' },
];

function matches(car: Car, search: string, filter: Filter): boolean {
  const query = search.trim().toLowerCase();
  const matchesSearch =
    !query ||
    car.plate.toLowerCase().includes(query) ||
    car.make.toLowerCase().includes(query) ||
    car.model.toLowerCase().includes(query) ||
    car.owner.toLowerCase().includes(query) ||
    car.phone.includes(query);

  const matchesFilter =
    filter === 'all' || (filter === 'debt' ? car.debt > 0 : car.status === filter);

  return matchesSearch && matchesFilter;
}

export default function GarageTab() {
  const router = useRouter();
  const cars = useCars();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (cars.data ?? []).filter((car) => matches(car, search, filter)),
    [cars.data, search, filter]
  );

  return (
    <Screen edges={['top']}>
      <ModeHeader title="Service" />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.brand}>
            <LogoMark size={36} />
            <View>
              <Text style={styles.kicker}>АВТО · СЕРВІС</Text>
              <Text style={styles.title}>ГАРАЖ</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Додати авто"
            onPress={() => router.push('/cars/new')}
            style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]}>
            <PlusIcon />
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <View style={styles.searchIcon}>
            <SearchIcon />
          </View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Номер, марка, телефон..."
            placeholderTextColor={colors.textFaint}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => {
            const active = filter === item.value;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setFilter(item.value)}
                style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <QueryState query={cars}>
        {() =>
          visible.length === 0 ? (
            <EmptyState text="Нічого не знайдено" />
          ) : (
            <FlatList
              data={visible}
              keyExtractor={(car) => String(car.id)}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <CarCard car={item} onPress={() => router.push(`/cars/${item.id}`)} />
              )}
            />
          )
        }
      </QueryState>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.textFaint,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  fab: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.accent,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  chips: {
    gap: spacing.sm,
    paddingTop: 10,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  chipIdle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.amber,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  chipLabelActive: {
    color: colors.surface,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: 10,
  },
});
