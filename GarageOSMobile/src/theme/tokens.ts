import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

export const colors = {
  ink: '#1A1714',
  inkSoft: '#1C1917',
  cream: '#EDE8DF',
  orange: '#C97B22',
  amber: '#B45309',
  brown: '#6B4F2A',
  facade: '#D4C9B8',

  bg: '#1A1714',
  surface: 'rgba(237, 232, 223, 0.06)',
  text: '#EDE8DF',
  textBody: 'rgba(237, 232, 223, 0.80)',
  textMuted: 'rgba(237, 232, 223, 0.55)',
  textFaint: 'rgba(237, 232, 223, 0.40)',
  border: 'rgba(237, 232, 223, 0.14)',
  borderSoft: 'rgba(237, 232, 223, 0.10)',
  fill: 'rgba(237, 232, 223, 0.06)',
  placeholder: 'rgba(237, 232, 223, 0.20)',

  onAccent: '#FFFFFF',

  warmSurface: '#EDE8DF',
  warmBorder: '#E0D8CB',
  warmDivider: '#F0EDE8',
  warmMuted: '#9A8E82',
  warmBody: '#6B6158',
  warmFaint: '#B5ABA0',
  warmChip: '#F3EDE0',

  blueOnInk: '#93C5FD',
  warningOnInk: '#E9A94F',
  successOnInk: '#34D399',
  dangerOnInk: '#FCA5A5',

  blue: '#2563EB',
  blueDark: '#1D4ED8',
  blueBg: 'rgba(37, 99, 235, 0.15)',
  blueBorder: 'rgba(147, 197, 253, 0.25)',
  warning: '#D97706',
  warningDark: '#B45309',
  warningBg: 'rgba(201, 123, 34, 0.12)',
  warningBorder: 'rgba(233, 169, 79, 0.25)',
  warningText: '#E9A94F',
  success: '#059669',
  successDark: '#047857',
  successBg: 'rgba(5, 150, 105, 0.15)',
  successSurface: 'rgba(5, 150, 105, 0.15)',
  successBorder: 'rgba(52, 211, 153, 0.25)',
  danger: '#DC2626',
  dangerDark: '#B91C1C',
  dangerBg: 'rgba(220, 38, 38, 0.12)',
  dangerBorder: 'rgba(248, 113, 113, 0.25)',
  profit: '#34D399',
  amberOnDark: '#E9A94F',
} as const;

export const onInk = {
  text: colors.cream,
  body: 'rgba(237, 232, 223, 0.70)',
  muted: 'rgba(237, 232, 223, 0.55)',
  faint: 'rgba(237, 232, 223, 0.40)',
  dim: 'rgba(237, 232, 223, 0.20)',
  border: 'rgba(237, 232, 223, 0.14)',
  divider: 'rgba(237, 232, 223, 0.10)',
  fill: 'rgba(237, 232, 223, 0.06)',
  ring: 'rgba(201, 123, 34, 0.25)',
  ringFaint: 'rgba(201, 123, 34, 0.12)',
  dangerFill: 'rgba(220, 38, 38, 0.12)',
  dangerBorder: 'rgba(248, 113, 113, 0.25)',
  dangerBorderStrong: 'rgba(248, 113, 113, 0.70)',
  warnFill: 'rgba(201, 123, 34, 0.12)',
  warnBorder: 'rgba(201, 123, 34, 0.30)',
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
  dialog: elevation(
    {
      shadowColor: '#000',
      shadowOpacity: 0.45,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    { elevation: 12 },
    { boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)' }
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
