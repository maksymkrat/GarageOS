import { StyleSheet, Text, View } from 'react-native';

import { STATUS_META } from '@/theme/status';
import { radius } from '@/theme/tokens';
import type { ClientVehicleStatus } from '@/types/domain';

export function StatusBadge({ status }: { status: ClientVehicleStatus }) {
  const meta = STATUS_META[status];

  return (
    <View style={[styles.badge, { backgroundColor: meta.background }]}>
      <View style={[styles.dot, { backgroundColor: meta.dot }]} />
      <Text style={[styles.label, { color: meta.text }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});
