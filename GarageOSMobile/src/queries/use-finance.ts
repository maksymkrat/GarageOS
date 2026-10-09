import { useQuery } from '@tanstack/react-query';

import { getFinanceOverview } from '@/api/finance';
import { queryKeys } from '@/queries/keys';
import type { FinancePeriod } from '@/types/domain';

export function useFinanceOverview(period: FinancePeriod) {
  return useQuery({
    queryKey: queryKeys.finance(period),
    queryFn: () => getFinanceOverview(period),
    placeholderData: (previous) => previous,
  });
}
