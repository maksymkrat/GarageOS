import { useMutation, useQuery } from '@tanstack/react-query';

import { getBotInfo, requestCode, verifyCode } from '@/api/auth';
import { queryKeys } from '@/queries/keys';

export function useRequestCode() {
  return useMutation({ mutationFn: requestCode });
}

export function useVerifyCode() {
  return useMutation({ mutationFn: verifyCode });
}

export function useBotInfo() {
  return useQuery({
    queryKey: queryKeys.bot,
    queryFn: getBotInfo,
    staleTime: Infinity,
  });
}
