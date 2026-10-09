const GROUP_SEPARATOR = ' ';

export function formatNumber(value: number): string {
  const [whole, fraction] = Math.abs(value).toFixed(value % 1 === 0 ? 0 : 2).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
  const sign = value < 0 ? '−' : '';
  return fraction ? `${sign}${grouped},${fraction}` : `${sign}${grouped}`;
}

export function formatMoney(value: number): string {
  return `${formatNumber(value)} ₴`;
}

export function formatPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `+38 (${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 8)}-${phone.slice(8)}`;
}

export function formatMileage(value: number, unit = 'км'): string {
  return `${formatNumber(value)} ${unit}`;
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
