import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

export interface IconProps {
  size?: number;
  color?: string;
}

const STROKE = {
  fill: 'none' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function HomeIcon({ size = 22, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Path d="M9 22V12h6v10" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function ToolboxIcon({ size = 22, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={2} y={7} width={20} height={14} rx={2} stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function MoneyIcon({ size = 22, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function BellIcon({ size = 22, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 18, color = colors.amber }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2.5} {...STROKE} />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 16, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function ArrowUpRightIcon({ size = 14, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M7 17L17 7M9 7h8v8" stroke={color} strokeWidth={2.6} {...STROKE} />
    </Svg>
  );
}

export function PlusIcon({ size = 18, color = colors.onAccent }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.5} {...STROKE} />
    </Svg>
  );
}

export function SearchIcon({ size = 16, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={10} cy={10} r={7} stroke={color} strokeWidth={2} {...STROKE} />
      <Path d="M15 15l5 5" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function PhoneIcon({ size = 14, color = colors.success }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14">
      <Path
        d="M13 9.5a11.2 11.2 0 01-3.5-.5l-1.5 1.5A11 11 0 012.5 4L4 2.5A11.2 11.2 0 013.5 1C3.5 1 1 1 1 4a12 12 0 008 8c3 0 3-2.5 3-2.5z"
        stroke={color}
        strokeWidth={2}
        {...STROKE}
      />
    </Svg>
  );
}

export function MessageIcon({ size = 16, color = colors.blue }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path d="M2 2h12v9H2z" stroke={color} strokeWidth={2} {...STROKE} />
      <Path d="M6 12l2 2 2-2" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function CameraIcon({ size = 24, color = colors.textFaint }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 16a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth={1.5} {...STROKE} />
      <Path
        d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2"
        stroke={color}
        strokeWidth={1.5}
        {...STROKE}
      />
    </Svg>
  );
}

export function CarGlyph({ size = 120, color = colors.onAccent }: IconProps) {
  return (
    <Svg width={size} height={(size / 120) * 80} viewBox="0 0 120 80">
      <Path
        d="M20 50h80M25 50l8-18h54l8 18M35 50v8M85 50v8M30 42h60"
        stroke={color}
        strokeWidth={1.5}
        {...STROKE}
      />
      <Circle cx={35} cy={58} r={6} fill={color} opacity={0.5} />
      <Circle cx={85} cy={58} r={6} fill={color} opacity={0.5} />
    </Svg>
  );
}

export function TelegramIcon({ size = 18, color = colors.cream }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M21.9 4.3c.3-1.2-.9-2.1-2-1.7L2.6 9.3c-1.2.5-1.2 2.2.1 2.6l4.4 1.4 1.7 5.4c.3 1 1.6 1.3 2.3.6l2.5-2.4 4.6 3.4c.9.7 2.2.2 2.5-.9l3.2-15.1zM9.6 14l8.2-7.4-6.6 8.9-.3 2.6-1.3-4.1z"
        fill={color}
      />
    </Svg>
  );
}

export function ChatIcon({ size = 16, color = colors.orange }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 12a8 8 0 01-11.8 7L4 20l1.1-4.6A8 8 0 1121 12z" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function ShieldCheckIcon({ size = 16, color = colors.orange }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6l8-3z" stroke={color} strokeWidth={2} {...STROKE} />
      <Path d="M8.5 12l2.5 2.5 4.5-5" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function PhoneFrameIcon({ size = 18, color = colors.ink }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={6} y={2.5} width={12} height={19} rx={3} stroke={color} strokeWidth={2} {...STROKE} />
      <Path d="M11 18h2" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function AlertCircleIcon({ size = 16, color = colors.danger }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} {...STROKE} />
      <Path d="M12 7.5v5.5M12 16.5v.01" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}

export function TrashIcon({ size = 20, color = colors.dangerOnInk }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 7h16" stroke={color} strokeWidth={1.8} {...STROKE} />
      <Path
        d="M10 4h4a1 1 0 011 1v2h-6V5a1 1 0 011-1z"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Path
        d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"
        stroke={color}
        strokeWidth={1.8}
        {...STROKE}
      />
      <Path d="M10 11v7M14 11v7" stroke={color} strokeWidth={1.8} {...STROKE} />
    </Svg>
  );
}

export function ClockIcon({ size = 16, color = colors.amberOnDark }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} {...STROKE} />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={2} {...STROKE} />
    </Svg>
  );
}
