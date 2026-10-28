import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  // `useColorScheme` answers null while the scheme is unknown (RN 0.88).
  const theme = useColorScheme() ?? 'light';

  return Colors[theme];
}
