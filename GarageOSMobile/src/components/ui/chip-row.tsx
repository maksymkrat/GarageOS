import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipRowProps<T extends string> {
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ChipRow<T extends string>({ label, options, value, onChange }: ChipRowProps<T>) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const active = option.value === value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && { opacity: 0.85 },
              ]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    borderColor: colors.amber,
    backgroundColor: colors.amber,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipLabelActive: {
    color: colors.onAccent,
  },
});
