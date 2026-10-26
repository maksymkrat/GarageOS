import type { ReminderItem } from '@/types/domain';

import { request } from './client';

export function getReminders(): Promise<ReminderItem[]> {
  return request('GET /reminders');
}
