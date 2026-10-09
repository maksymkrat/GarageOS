import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  // Brand
  ink: '#1A1714',
  inkSoft: '#1C1917',
  cream: '#EDE8DF',
  orange: '#C97B22',
  amber: '#B45309',
  brown: '#6B4F2A',
  facade: '#D4C9B8',

  // Service surfaces — cool neutrals
  bg: '#FAFAF8',
  surface: '#FFFFFF',
  text: '#111827',
  textBody: '#374151',
  textMuted: '#6B7280',
  textFaint: '#9CA3AF',
  border: '#E5E7EB',
  borderSoft: '#F3F4F6',
  fill: '#F3F4F6',
  placeholder: '#D1D5DB',

  // Home & personal surfaces — warm neutrals
  warmSurface: '#EDE8DF',
  warmBorder: '#E0D8CB',
  warmDivider: '#F0EDE8',
  warmMuted: '#9A8E82',
  warmBody: '#6B6158',
  warmFaint: '#B5ABA0',
  warmChip: '#F3EDE0',

  // Semantic
  blue: '#2563EB',
  blueDark: '#1D4ED8',
  blueBg: '#EFF6FF',
  warning: '#D97706',
  warningDark: '#B45309',
  warningBg: '#FEF3C7',
  warningText: '#92400E',
  success: '#059669',
  successDark: '#047857',
  successBg: '#ECFDF5',
  successSurface: '#F0FDF4',
  successBorder: '#BBF7D0',
  danger: '#DC2626',
  dangerDark: '#B91C1C',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',
  profit: '#34D399',
  amberOnDark: '#E9A94F',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  sheet: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const fontFamily = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  android: { sans: 'normal', mono: 'monospace' },
  default: { sans: 'var(--font-display)', mono: 'var(--font-mono)' },
});

function elevation(ios: ViewStyle, android: ViewStyle, web: ViewStyle): ViewStyle {
  return Platform.select({ ios, android, default: web });
}

export const shadows = {
  card: elevation(
    {
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
    },
    { elevation: 2 },
    { boxShadow: '0 1px 4px rgba(0, 0, 0, 0.07)' }
  ),
  accent: elevation(
    {
      shadowColor: colors.amber,
      shadowOpacity: 0.35,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
    { elevation: 4 },
    { boxShadow: '0 2px 8px rgba(180, 83, 9, 0.35)' }
  ),
  submit: elevation(
    {
      shadowColor: colors.amber,
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
    { elevation: 6 },
    { boxShadow: '0 4px 16px rgba(180, 83, 9, 0.30)' }
  ),
} as const;
