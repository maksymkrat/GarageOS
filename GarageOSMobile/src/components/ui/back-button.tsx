import { useRouter, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ChevronLeftIcon } from '@/components/icons';
import { colors } from '@/theme/tokens';

interface BackButtonProps {
  fallback: Href;
  label?: string;
  color?: string;
}

export function BackButton({ fallback, label = 'Назад', color = colors.amber }: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback))}
      accessibilityRole="button"
      hitSlop={10}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <ChevronLeftIcon color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
