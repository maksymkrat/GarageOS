import { useQuery } from '@tanstack/react-query';

import { getReminders } from '@/api/reminders';
import { queryKeys } from '@/queries/keys';

export function useReminders() {
  return useQuery({ queryKey: queryKeys.reminders, queryFn: getReminders });
}
