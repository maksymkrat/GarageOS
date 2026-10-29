import { StyleSheet, Text, View } from 'react-native';

import { clientVehiclePhotoSource } from '@/api/client-vehicles';
import { Avatar } from '@/components/ui/avatar';
import { VehicleImage } from '@/components/ui/vehicle-image';
import { PressableCard } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatMoney } from '@/lib/format';
import { colors, fontFamily, radius, spacing } from '@/theme/tokens';
import type { ClientVehicle } from '@/types/domain';

interface ClientVehicleCardProps {
  vehicle: ClientVehicle;
  onPress: () => void;
}

export function ClientVehicleCard({ vehicle, onPress }: ClientVehicleCardProps) {
  return (
    <PressableCard onPress={onPress} accessibilityLabel={vehicle.plate} style={styles.card}>
      <View style={styles.row}>
        <VehicleImage
          source={
            vehicle.photoId === undefined
              ? null
              : clientVehiclePhotoSource(vehicle.id, vehicle.photoId, 'thumb')
          }
          glyph={44}
          style={styles.photo}
        />

        <View style={styles.main}>
          <Text style={styles.plate}>{vehicle.plate}</Text>
          <Text style={styles.model} numberOfLines={1}>
            {vehicle.make} {vehicle.model}
            {vehicle.year !== undefined && <Text style={styles.year}> {vehicle.year}</Text>}
          </Text>
          <View style={styles.ownerRow}>
            <Avatar name={vehicle.owner} />
            <Text style={styles.owner}>{vehicle.owner}</Text>
          </View>
        </View>

        <View style={styles.side}>
          <StatusBadge status={vehicle.status} />
          {vehicle.debt > 0 && <Text style={styles.debt}>−{formatMoney(vehicle.debt)}</Text>}
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
  photo: {
    width: 72,
    height: 72,
    alignSelf: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.fill,
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
    color: colors.dangerOnInk,
  },
});
