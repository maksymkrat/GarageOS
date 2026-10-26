import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, radius, spacing } from '@/theme/tokens';

interface TextAreaProps extends TextInputProps {
  label: string;
  error?: string;
  minHeight?: number;
}

export function TextArea({ label, error, minHeight = 84, style, ...inputProps }: TextAreaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.placeholder}
        {...inputProps}
        multiline
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
          { minHeight },
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
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: colors.amber,
  },
  invalid: {
    borderColor: colors.dangerBorder,
  },
  error: {
    fontSize: 11,
    color: colors.dangerOnInk,
  },
});
