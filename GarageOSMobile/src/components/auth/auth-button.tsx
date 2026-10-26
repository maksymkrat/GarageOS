import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, onInk, radius, shadows, spacing } from '@/theme/tokens';

interface AuthButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  disabled?: boolean;
  busy?: boolean;
}

export function AuthButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  busy = false,
}: AuthButtonProps) {
  const primary = variant === 'primary';
  const inert = disabled || busy;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inert, busy }}
      disabled={inert}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primary : styles.ghost,
        inert && styles.inert,
        pressed && !inert && styles.pressed,
      ]}>
      {busy ? (
        <ActivityIndicator size="small" color={primary ? colors.ink : onInk.text} />
      ) : (
        icon
      )}
      <Text style={[styles.label, primary ? styles.labelPrimary : styles.labelGhost]}>{label}</Text>
    </Pressable>
  );
}

export function AuthLink({
  label,
  onPress,
  icon,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
      {icon}
      <Text style={styles.linkLabel}>{label}</Text>
    </Pressable>
  );
}

export function AuthTitle({ first, accent }: { first: string; accent: string }) {
  return (
    <Text style={styles.title}>
      {first}
      {'\n'}
      <Text style={styles.titleAccent}>{accent}</Text>
    </Text>
  );
}

export function AuthLead({ children }: { children: ReactNode }) {
  return <Text style={styles.lead}>{children}</Text>;
}

export function AuthHint({ children, center }: { children: ReactNode; center?: boolean }) {
  return <Text style={[styles.hint, center && styles.centered]}>{children}</Text>;
}

export function AuthRings() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.ring, styles.ringInner]} />
      <View style={[styles.ring, styles.ringOuter]} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
  },
  primary: {
    backgroundColor: colors.orange,
    ...shadows.submit,
  },
  ghost: {
    backgroundColor: onInk.fill,
    borderWidth: 1,
    borderColor: onInk.border,
  },
  inert: {
    opacity: 0.4,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  labelPrimary: {
    color: colors.ink,
  },
  labelGhost: {
    color: onInk.text,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  linkLabel: {
    fontSize: 13,
    textAlign: 'center',
    color: onInk.muted,
  },
  title: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: onInk.text,
  },
  titleAccent: {
    color: colors.orange,
  },
  lead: {
    marginTop: spacing.md,
    fontSize: 14,
    lineHeight: 20,
    color: onInk.muted,
  },
  hint: {
    fontSize: 11,
    lineHeight: 16,
    color: onInk.faint,
  },
  centered: {
    textAlign: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  ringInner: {
    width: 176,
    height: 176,
    top: -64,
    right: -64,
    borderColor: onInk.ring,
  },
  ringOuter: {
    width: 288,
    height: 288,
    top: -112,
    right: -112,
    borderColor: onInk.ringFaint,
  },
});
