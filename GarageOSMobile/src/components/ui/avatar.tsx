import { StyleSheet, Text, View } from 'react-native';

import { initials } from '@/lib/format';
import { colors, radius } from '@/theme/tokens';

export function Avatar({ name }: { name: string }) {
  return (
    <View style={styles.circle}>
      <Text style={styles.text}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.warmChip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.amber,
  },
});
