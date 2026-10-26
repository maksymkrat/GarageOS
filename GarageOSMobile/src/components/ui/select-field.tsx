import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ChevronDownIcon } from '@/components/icons';
import { colors, radius, spacing } from '@/theme/tokens';

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  // A model cannot be picked before a make is, and the field says so by
  // looking inert rather than by opening an empty list.
  disabled?: boolean;
  onPress: () => void;
}

// The shape of TextField, with a list behind it instead of a keyboard: the two
// sit in the same form, so a value picked from a list must not read as a
// different kind of field from one typed in.
export function SelectField({
  label,
  value,
  placeholder,
  error,
  disabled = false,
  onPress,
}: SelectFieldProps) {
  const empty = !value;

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.input,
          !!error && styles.invalid,
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}>
        <Text style={[styles.value, empty && styles.placeholder]} numberOfLines={1}>
          {empty ? placeholder : value}
        </Text>
        <ChevronDownIcon />
      </Pressable>

      {!!error && <Text style={styles.error}>{error}</Text>}
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
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  invalid: {
    borderColor: colors.dangerBorder,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  placeholder: {
    color: colors.placeholder,
  },
  error: {
    fontSize: 11,
    color: colors.dangerOnInk,
  },
});
