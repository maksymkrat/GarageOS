// `expo start`, plus a reload once the app reconnects — a restarted bundler
// otherwise leaves the phone on the bundle from before.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

import { reloadConnectedApps } from './reload-app.mjs';

const RECONNECT_WINDOW_MS = 120_000;

const require = createRequire(import.meta.url);

const cli = require.resolve('expo/bin/cli');

const args = process.argv.slice(2);

function resolvePort() {
  const flag = args.findIndex((arg) => arg === '--port' || arg === '-p');

  if (flag !== -1 && args[flag + 1]) return Number(args[flag + 1]);

  const inline = args.find((arg) => arg.startsWith('--port='));

  if (inline) return Number(inline.slice('--port='.length));

  return Number(process.env.RCT_METRO_PORT) || 8081;
}

const port = resolvePort();

const bundler = spawn(process.execPath, [cli, 'start', ...args], {
  stdio: 'inherit',
});

bundler.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});

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
