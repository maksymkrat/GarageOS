import type { ClientVehicleStatus, LogEntryKind } from '@/types/domain';

import { colors } from './tokens';

interface StatusMeta {
  label: string;
  text: string;
  background: string;
  dot: string;
}

export const STATUS_META: Record<ClientVehicleStatus, StatusMeta> = {
  in_work: {
    label: 'В роботі',
    text: colors.blueOnInk,
    background: 'rgba(37, 99, 235, 0.12)',
    dot: colors.blue,
  },
  waiting_part: {
    label: 'Чекає деталь',
    text: colors.warningOnInk,
    background: 'rgba(217, 119, 6, 0.12)',
    dot: colors.warning,
  },
  ready: {
    label: 'Готово',
    text: colors.successOnInk,
    background: 'rgba(5, 150, 105, 0.12)',
    dot: colors.success,
  },
  has_debt: {
    label: 'Чекаю оплату',
    text: colors.dangerOnInk,
    background: 'rgba(220, 38, 38, 0.12)',
    dot: colors.danger,
  },
};

export const LOG_KIND_COLOR: Record<LogEntryKind, string> = {
  oil: colors.orange,
  brakes: '#F87171',
  tires: colors.cream,
  filter: '#7C8B6F',
  other: '#6F6A65',
};

export const LOG_KIND_LABEL: Record<LogEntryKind, string> = {
  oil: 'Олива',
  brakes: 'Гальма',
  tires: 'Шини',
  filter: 'Фільтр',
  other: 'Інше',
};
