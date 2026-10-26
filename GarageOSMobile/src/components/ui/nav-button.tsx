import { useRouter, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ChevronLeftIcon, HomeIcon } from '@/components/icons';
import { colors, radius } from '@/theme/tokens';

interface NavButtonProps {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// One square for both, and the same square on every screen: the button that
// leaves a screen must not change shape depending on where you are.
function NavButton({ label, onPress, style, children }: NavButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

// Opens the mode picker. Sits where a section's own screens would show Back.
export function HomeButton({ style }: { style?: StyleProp<ViewStyle> }) {
  const router = useRouter();

  return (
    <NavButton label="На головну" onPress={() => router.dismissTo('/')} style={style}>
      <HomeIcon size={18} color={colors.amber} />
    </NavButton>
  );
}

export function BackButton({ fallback, style }: { fallback: Href; style?: StyleProp<ViewStyle> }) {
  const router = useRouter();

  return (
    <NavButton
      label="Назад"
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
      style={style}>
      <ChevronLeftIcon size={18} color={colors.amber} />
    </NavButton>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.7,
  },
});
