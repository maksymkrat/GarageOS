import type { ReminderItem } from '@/types/domain';

import { store } from './mock/store';
import { request } from './mock/transport';

export function getReminders(): Promise<ReminderItem[]> {
  return request('GET /reminders', () =>
    store.reminders.flatMap<ReminderItem>((reminder) => {
      const car = store.cars.find((row) => row.id === reminder.carId);
      if (!car) return [];

      return [
        {
          id: reminder.id,
          carId: car.id,
          plate: car.plate,
          owner: car.owner,
          phone: car.phone,
          what: reminder.what,
          overdue: reminder.overdue,
        },
      ];
    })
  );
}
