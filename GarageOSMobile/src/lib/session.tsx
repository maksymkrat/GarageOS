import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { refreshSession, signOut as signOutRequest } from '@/api/auth';
import { ApiError, setAccessToken, setUnauthorizedHandler } from '@/api/client';
import type { Session } from '@/types/domain';

const STORE_KEY = 'garageos.session';

interface SessionValue {
  session: Session | null;
  // True until the stored session has been read and checked, so the navigator
  // does not flash the sign-in screen at somebody who is signed in.
  restoring: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

async function save(session: Session | null): Promise<void> {
  try {
    if (session === null) await SecureStore.deleteItemAsync(STORE_KEY);
    else await SecureStore.setItemAsync(STORE_KEY, JSON.stringify(session));
  } catch (cause) {
    if (__DEV__) console.warn('[session] не вдалося зберегти сесію:', cause);
  }
}

async function load(): Promise<Session | null> {
  try {
    const stored = await SecureStore.getItemAsync(STORE_KEY);

    return stored === null ? null : (JSON.parse(stored) as Session);
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [restoring, setRestoring] = useState(true);

  // The live session for callbacks that must not be re-created on every
  // change, and the refresh in flight, so a burst of 401s asks once.
  const current = useRef<Session | null>(null);
  const refreshing = useRef<Promise<string | null> | null>(null);

  const apply = useCallback((next: Session | null) => {
    current.current = next;
    setAccessToken(next?.accessToken ?? null);
    setSession(next);
    void save(next);
  }, []);

  const signIn = useCallback((next: Session) => apply(next), [apply]);

  const signOut = useCallback(() => {
    void signOutRequest().catch(() => undefined);

    apply(null);
  }, [apply]);

  // Swaps an expired access token for a new one without the person noticing.
  // The server counts the session from the sign-in and does not extend it
  // here, so this keeps the day going and ends with it (ADR-0028).
  const renew = useCallback(async (): Promise<string | null> => {
    const token = current.current?.refreshToken;

    if (token === undefined) return null;

    refreshing.current ??= refreshSession(token)
      .then((next) => {
        apply(next);
        return next.accessToken;
      })
      .catch((cause) => {
        // A server that cannot be reached is not a session that has ended:
        // signing the master out because the Wi-Fi dropped would cost a
        // Telegram code for nothing. The stored tokens stay, and the next
        // request tries again.
        if (!(cause instanceof ApiError) || cause.status !== 0) apply(null);

        return null;
      })
      .finally(() => {
        refreshing.current = null;
      });

    return refreshing.current;
  }, [apply]);

  useEffect(() => {
    setUnauthorizedHandler(renew);
  }, [renew]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await load();

      if (cancelled) return;

      if (stored === null) {
        setRestoring(false);
        return;
      }

      // Shown first, checked second: the app opens where it was left, and
      // the refresh that follows either hands over newer tokens or, if the
      // fourteen hours are up, drops the session and shows the sign-in.
      apply(stored);

      await renew();

      if (!cancelled) setRestoring(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [apply, renew]);

  const value = useMemo(
    () => ({ session, restoring, signIn, signOut }),
    [session, restoring, signIn, signOut]
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionValue {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession must be wrapped in a <SessionProvider />');

  return value;
}
