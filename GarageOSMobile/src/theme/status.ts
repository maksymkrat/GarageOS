import type { CarStatus, LogEntryKind } from '@/types/domain';

import { colors } from './tokens';

interface StatusMeta {
  label: string;
  text: string;
  background: string;
  dot: string;
}

export const STATUS_META: Record<CarStatus, StatusMeta> = {
  in_work: {
    label: 'В роботі',
    text: colors.blueDark,
    background: 'rgba(37, 99, 235, 0.12)',
    dot: colors.blue,
  },
  waiting_part: {
    label: 'Чекає деталь',
    text: colors.warningDark,
    background: 'rgba(217, 119, 6, 0.12)',
    dot: colors.warning,
  },
  ready: {
    label: 'Готово',
    text: colors.successDark,
    background: 'rgba(5, 150, 105, 0.12)',
    dot: colors.success,
  },
  has_debt: {
    label: 'Борг',
    text: colors.dangerDark,
    background: 'rgba(220, 38, 38, 0.12)',
    dot: colors.danger,
  },
};

export const LOG_KIND_COLOR: Record<LogEntryKind, string> = {
  oil: colors.orange,
  brakes: colors.dangerDark,
  tires: colors.ink,
  filter: '#7C8B6F',
  other: colors.warmMuted,
};
