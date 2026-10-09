import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/queries/client';
import { colors } from '@/theme/tokens';

/**
 * Expo Router sorts explicitly declared `Stack.Screen` children ahead of the
 * file-system ones, so declaring `cars/new` on its own made it `routeNames[0]`
 * — the stack's initial route — and the app booted straight into the modal.
 * `index` is declared first, and anchored, so home is always the entry screen.
 */
export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cars/new" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
