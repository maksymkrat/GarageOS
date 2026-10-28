import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// Nothing to subscribe to: the only transition is server snapshot -> client
// snapshot, which React performs once, on hydration.
const subscribe = () => () => {};

export function useColorScheme() {
  // The web build renders markup before hydration, where the device scheme is
  // unknown. The server snapshot keeps that first paint on 'light' so it
  // matches the markup; the real scheme arrives with hydration.
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
