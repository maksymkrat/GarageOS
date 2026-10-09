import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { PressableCard } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatMoney } from '@/lib/format';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';
import type { Car } from '@/types/domain';

interface CarCardProps {
  car: Car;
  onPress: () => void;
}

export function CarCard({ car, onPress }: CarCardProps) {
  return (
    <PressableCard onPress={onPress} accessibilityLabel={car.plate} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.plate}>{car.plate}</Text>
          <Text style={styles.model} numberOfLines={1}>
            {car.make} {car.model} <Text style={styles.year}>{car.year}</Text>
          </Text>
          <View style={styles.ownerRow}>
            <Avatar name={car.owner} />
            <Text style={styles.owner}>{car.owner}</Text>
          </View>
        </View>

        <View style={styles.side}>
          <StatusBadge status={car.status} />
          {car.debt > 0 && <Text style={styles.debt}>−{formatMoney(car.debt)}</Text>}
        </View>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  main: {
    flex: 1,
  },
  plate: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: colors.text,
    fontFamily: fontFamily.mono,
  },
  model: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textBody,
  },
  year: {
    fontWeight: '400',
    color: colors.textFaint,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  owner: {
    fontSize: 12,
    color: colors.textMuted,
  },
  side: {
    alignItems: 'flex-end',
    gap: 6,
  },
  debt: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.dangerDark,
  },
});
