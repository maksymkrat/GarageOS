import { StyleSheet, Text, View } from 'react-native';

import { LogoMark } from '@/components/logo-mark';
import { colors, onInk, spacing } from '@/theme/tokens';

interface BrandRowProps {
  compact?: boolean;
}

export function BrandRow({ compact = false }: BrandRowProps) {
  return (
    <View style={styles.row}>
      <LogoMark size={compact ? 40 : 56} onDark />
      <View>
        <Text style={styles.name}>ГАРАЖ</Text>
        {!compact && <Text style={styles.tagline}>Авто · Сервіс</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: onInk.text,
  },
  tagline: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.orange,
  },
});
