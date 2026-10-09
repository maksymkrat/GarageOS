import Svg, { G, Path, Polygon, Rect } from 'react-native-svg';

import { colors } from '@/theme/tokens';

interface LogoMarkProps {
  size?: number;
  onDark?: boolean;
}

/** Garage facade with a car in the doorway — the brand mark from the design. */
export function LogoMark({ size = 40, onDark = false }: LogoMarkProps) {
  const wall = onDark ? '#F0EAE0' : colors.cream;
  const outline = onDark ? 'rgba(240, 234, 224, 0.7)' : 'rgba(26, 23, 20, 0.75)';
  const glass = onDark ? 'rgba(240, 234, 224, 0.22)' : 'rgba(26, 23, 20, 0.30)';
  const stroke = 13;

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <G transform="translate(4, 2) scale(0.2227)">
        <Rect
          x={10.2}
          y={150.4}
          width={491.6}
          height={339.9}
          fill={wall}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Polygon
          points="420.2,21.7 91.8,21.7 10.2,150.4 501.8,150.4"
          fill={colors.orange}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Polygon
          points="109.6,312.0 402.4,312.0 352.2,202.1 159.8,202.1"
          fill={colors.facade}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Path
          d="M426.5,421.8H85.5V340.2c0-15.6,12.6-28.2,28.2-28.2H398.3c15.6,0,28.2,12.6,28.2,28.2V421.8z"
          fill={colors.orange}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Rect
          x={192.7}
          y={381}
          width={126.7}
          height={40.8}
          rx={8}
          fill={wall}
          opacity={0.9}
          stroke={outline}
          strokeWidth={stroke}
        />
        <Rect
          x={105.4}
          y={421.8}
          width={49.2}
          height={68.5}
          fill={colors.brown}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Rect
          x={357.5}
          y={421.8}
          width={49.2}
          height={68.5}
          fill={colors.brown}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />

        <Path
          d="M 152 418 L 360 418 L 354 388 L 334 364 L 178 364 L 158 388 Z"
          fill={wall}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Path
          d="M 185 366 L 174 386 L 338 386 L 327 366 Z"
          fill={glass}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <Rect
          x={154}
          y={394}
          width={48}
          height={16}
          rx={6}
          fill={colors.orange}
          stroke={outline}
          strokeWidth={9}
        />
        <Rect
          x={310}
          y={394}
          width={48}
          height={16}
          rx={6}
          fill={colors.orange}
          stroke={outline}
          strokeWidth={9}
        />
      </G>
    </Svg>
  );
}
