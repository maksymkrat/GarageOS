// `expo start`, plus the one thing it does not do by itself: when the bundler
// comes back up, the phone is still running the bundle from before the restart
// and waits for somebody to shake it. This pushes a reload as soon as the app
// reconnects, so restarting the dev server rebuilds on the device on its own.
//
// Everything after `npm run dev --` goes to `expo start` unchanged, so
// `npm run dev -- --clear` still works.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

import { reloadConnectedApps } from './reload-app.mjs';

// How long a reconnect may take before we stop waiting. Longer than it ever
// takes in practice — an app that connects later loads the fresh bundle anyway,
// so the only cost of giving up is one line of output.
const RECONNECT_WINDOW_MS = 120_000;

const require = createRequire(import.meta.url);

// The CLI inside the installed `expo` package rather than `npx`: same binary
// `npm start` would reach, without a resolution step that can go to the network.
const cli = require.resolve('expo/bin/cli');

const args = process.argv.slice(2);

// The reload has to knock on the same port the bundler listens on, and the
// port can come from the command line as well as from the environment.
function resolvePort() {
  const flag = args.findIndex((arg) => arg === '--port' || arg === '-p');

  if (flag !== -1 && args[flag + 1]) return Number(args[flag + 1]);

  const inline = args.find((arg) => arg.startsWith('--port='));

  if (inline) return Number(inline.slice('--port='.length));

  return Number(process.env.RCT_METRO_PORT) || 8081;
}

const port = resolvePort();

// `inherit` keeps the terminal interactive, so the usual `r`, `j` and `m` keys
// of `expo start` keep working when this runs in the foreground.
const bundler = spawn(process.execPath, [cli, 'start', ...args], {
  stdio: 'inherit',
});

bundler.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});

// Alongside the bundler, not after it: `expo start` never finishes.
const reached = await reloadConnectedApps({
  port,
  waitMs: RECONNECT_WINDOW_MS,
  log: (line) => console.log(`\n${line}`),
});

console.log(
  reached === 0
    ? '\nНіхто не під\'єднався — відкрий проєкт на телефоні, він візьме свіжий бандл сам.'
    : `\nПерезавантажено застосунків: ${reached}.`
);
