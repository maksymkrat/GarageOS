import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { TrashIcon } from '@/components/icons';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { colors, onInk, radius, spacing } from '@/theme/tokens';

interface DangerButtonProps {
  label: string;
  confirmTitle: string;
  confirmBody: string;
  confirmLabel?: string;
  pending: boolean;
  onConfirm: () => void;
}

export function DangerButton({
  label,
  confirmTitle,
  confirmBody,
  confirmLabel = 'Видалити',
  pending,
  onConfirm,
}: DangerButtonProps) {
  const [asking, setAsking] = useState(false);

  function confirm() {
    setAsking(false);
    onConfirm();
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        disabled={pending}
        onPress={() => setAsking(true)}
        style={({ pressed }) => [styles.button, (pressed || pending) && styles.pressed]}>
        {pending ? (
          <ActivityIndicator color={colors.dangerOnInk} />
        ) : (
          <View style={styles.inner}>
            <TrashIcon size={18} />
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      </Pressable>

      <ConfirmDialog
        visible={asking}
        title={confirmTitle}
        body={confirmBody}
        confirmLabel={confirmLabel}
        onConfirm={confirm}
        onCancel={() => setAsking(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: onInk.dangerBorder,
    backgroundColor: onInk.dangerFill,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dangerOnInk,
  },
});
