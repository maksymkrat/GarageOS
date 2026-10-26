import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';

import { signOut as signOutRequest } from '@/api/auth';
import { setAccessToken } from '@/api/client';
import type { Session } from '@/types/domain';

interface SessionValue {
  session: Session | null;
  signIn: (session: Session) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = useCallback((next: Session) => {
    setAccessToken(next.accessToken);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    void signOutRequest().catch(() => undefined);

    setAccessToken(null);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionValue {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be wrapped in a <SessionProvider />');

  return value;
}
