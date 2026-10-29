import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';

import { SessionProvider, useSession } from '@/lib/session';
import { queryClient } from '@/queries/client';
import { colors } from '@/theme/tokens';

export const unstable_settings = {
  anchor: 'index',
};

void SystemUI.setBackgroundColorAsync(colors.ink);

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </QueryClientProvider>
  );
}

function RootNavigator() {
  const { session, restoring } = useSession();
  const signedIn = !!session;

  if (restoring) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: signedIn ? colors.bg : colors.ink },
        }}>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(service)" />
          <Stack.Screen name="client-vehicles/[id]" />
          <Stack.Screen name="client-vehicles/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/[id]" />
          <Stack.Screen name="orders/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/work" options={{ presentation: 'modal' }} />
          <Stack.Screen name="orders/part" options={{ presentation: 'modal' }} />
          <Stack.Screen name="personal/index" />
          <Stack.Screen name="personal/[id]" />
          <Stack.Screen name="personal/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="personal/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="personal/log/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="personal/log/edit" options={{ presentation: 'modal' }} />
          <Stack.Screen name="explore" />
        </Stack.Protected>

        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
