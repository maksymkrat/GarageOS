import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronLeftIcon } from '@/components/icons';
import { colors, radius, spacing } from '@/theme/tokens';

/** "Home" chip plus the current workspace label, shared by both app modes. */
export function ModeHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="На головну"
        onPress={() => router.dismissTo('/')}
        style={({ pressed }) => [styles.chip, pressed && { opacity: 0.7 }]}>
        <ChevronLeftIcon size={12} color={colors.warmBody} />
        <Text style={styles.chipLabel}>Home</Text>
      </Pressable>
      <Text style={styles.mode}>{title.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.warmSurface,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.warmBody,
  },
  mode: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.orange,
  },
});
