import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { TrashIcon } from '@/components/icons';
import { colors, onInk, radius, shadows, spacing } from '@/theme/tokens';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'accent';
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  visible,
  title,
  body,
  confirmLabel,
  cancelLabel = 'Скасувати',
  tone = 'danger',
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const accent = tone === 'accent';
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
          <View style={[styles.badge, accent && styles.badgeAccent]}>
            {icon ?? <TrashIcon size={22} />}
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.body}>{body}</Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}>
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.confirm,
                accent && styles.confirmAccent,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
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
  badge: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: onInk.dangerFill,
    borderWidth: 1,
    borderColor: onInk.dangerBorder,
  },
  badgeAccent: {
    backgroundColor: onInk.warnFill,
    borderColor: onInk.warnBorder,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: onInk.body,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  cancel: {
    flex: 1,
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
  confirm: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
  },
  confirmAccent: {
    backgroundColor: colors.amber,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onAccent,
  },
});
