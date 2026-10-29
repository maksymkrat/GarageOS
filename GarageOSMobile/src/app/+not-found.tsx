import { Redirect } from 'expo-router';

import { useSession } from '@/lib/session';

// Both halves of the route tree sit behind `Stack.Protected`, so at any moment
// one of them is not registered at all — and `/` is among the screens that the
// gate takes away. Opening the app by its scheme (`garageos:///`) while signed
// out therefore matched nothing and dead-ended on «page could not be found»,
// with no way back to the sign-in. Anything unmatched now lands where the gate
// would have sent it: the sign-in for a stranger, the home screen for a
// session — which also covers links to screens that no longer exist.
export default function NotFoundRoute() {
  const { session } = useSession();

  return <Redirect href={session === null ? '/sign-in' : '/'} />;
}
