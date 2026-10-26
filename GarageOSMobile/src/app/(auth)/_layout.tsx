import { Stack } from 'expo-router/stack';

import { colors } from '@/theme/tokens';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.ink },
      }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="code" />
    </Stack>
  );
}
