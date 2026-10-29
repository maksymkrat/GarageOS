import type { MileageUnit } from '@/types/domain';

const GROUP_SEPARATOR = ' ';

const MILEAGE_UNIT_LABEL: Record<MileageUnit, string> = {
  km: 'км',
  hours: 'мотогод',
};

export function formatNumber(value: number): string {
  const [whole, fraction] = Math.abs(value).toFixed(value % 1 === 0 ? 0 : 2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
  const sign = value < 0 ? '−' : '';
  return fraction ? `${sign}${grouped},${fraction}` : `${sign}${grouped}`;
}

export function formatMoney(value: number): string {
  return `${formatNumber(value)} ₴`;
}

export function parseMoney(value: string): number | null {
  const normalized = value.replace(/\s/g, '').replace(',', '.');

  return /^\d+(\.\d{1,2})?$/.test(normalized) ? Number(normalized) : null;
}

export function formatPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `+38 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

export function mileageUnitLabel(unit: MileageUnit): string {
  return MILEAGE_UNIT_LABEL[unit];
}

export function formatMileage(value: number, unit: MileageUnit = 'km'): string {
  return `${formatNumber(value)} ${MILEAGE_UNIT_LABEL[unit]}`;
}

export function initials(fullName: string): string {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase();
}

export function todayLabel(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
}

export function vocative(firstName: string): string {
  if (firstName.length < 3) return firstName;

  const stem = firstName.slice(0, -1);

  if (firstName.endsWith('й')) return `${stem}ю`;
  if (firstName.endsWith('а')) return `${stem}о`;

  return firstName;
}
