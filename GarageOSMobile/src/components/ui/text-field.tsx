import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontFamily, radius, spacing } from '@/theme/tokens';

interface TextFieldProps extends TextInputProps {
  label: string;
  mono?: boolean;
  error?: string;
}

export function TextField({ label, mono, error, style, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        {...inputProps}
        onFocus={(event) => {
          setFocused(true);
          inputProps.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          inputProps.onBlur?.(event);
        }}
        style={[
          styles.input,
          mono && styles.mono,
          focused && styles.focused,
          !!error && styles.invalid,
          style,
        ]}
      />
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
  },
  mono: {
    fontFamily: fontFamily.mono,
    letterSpacing: 1.5,
  },
  focused: {
    borderColor: colors.amber,
  },
  invalid: {
    borderColor: colors.dangerBorder,
  },
  error: {
    fontSize: 11,
    color: colors.dangerDark,
  },
});
