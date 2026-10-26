import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, onInk, radius, shadows, spacing } from '@/theme/tokens';

export interface PickerOption<T extends string> {
  value: T;
  label: string;
  dot?: string;
}

interface PickerDialogProps<T extends string> {
  visible: boolean;
  title: string;
  options: PickerOption<T>[];
  value: T;
  busy?: boolean;
  error?: string;
  onPick: (value: T) => void;
  onCancel: () => void;
}

export function PickerDialog<T extends string>({
  visible,
  title,
  options,
  value,
  busy,
  error,
  onPick,
  onCancel,
}: PickerDialogProps<T>) {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Закрити"
          onPress={onCancel}
          style={styles.backdrop}
        />

        <View accessibilityViewIsModal style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.options}>
            {options.map((option) => {
              const active = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active, disabled: busy }}
                  disabled={busy}
                  onPress={() => onPick(option.value)}
                  style={({ pressed }) => [
                    styles.option,
                    active && styles.optionActive,
                    pressed && { opacity: 0.85 },
                  ]}>
                  {option.dot !== undefined && (
                    <View style={[styles.dot, { backgroundColor: option.dot }]} />
                  )}
                  <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                    {option.label}
                  </Text>
                  {active && <Text style={styles.check}>✓</Text>}
                </Pressable>
              );
            })}
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable
            accessibilityRole="button"
            onPress={onCancel}
            style={({ pressed }) => [styles.cancel, pressed && { opacity: 0.85 }]}>
            <Text style={styles.cancelLabel}>Скасувати</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(10, 8, 6, 0.72)',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.inkSoft,
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: onInk.border,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadows.dialog,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.border,
  },
  optionActive: {
    borderColor: colors.amber,
    backgroundColor: colors.warningBg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textBody,
  },
  optionLabelActive: {
    fontWeight: '700',
    color: colors.text,
  },
  check: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.amberOnDark,
  },
  error: {
    fontSize: 13,
    color: colors.dangerOnInk,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: onInk.border,
  },
  cancelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
