// Pushes a reload to every app already connected to the Metro dev server, so a
// restarted bundler does not leave the phone sitting on the previous bundle.
//
// Metro exposes a websocket at `/message`. A client connected from this machine
// is trusted and may broadcast `reload` and `devMenu` to every connected app —
// that is the same channel the `r` key of `expo start` uses, and the only way
// to trigger a reload without touching the phone.
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8081;

// Metro's own framing: anything with a different version is dropped silently.
const PROTOCOL_VERSION = 2;

const CONNECT_TIMEOUT_MS = 2_000;
const REPLY_TIMEOUT_MS = 2_000;
const RETRY_DELAY_MS = 1_000;

// Waits for one reply with our id and ignores the broadcasts that arrive in the
// meantime — the socket carries every client's traffic, not only ours.
function request(socket, method) {
  const id = `reload-app-${Date.now()}`;

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.removeEventListener('message', onMessage);
      reject(new Error(`Metro не відповів на ${method}`));
    }, REPLY_TIMEOUT_MS);

    function onMessage(event) {
      let message;

      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }

      if (message?.id !== id) return;

      clearTimeout(timer);
      socket.removeEventListener('message', onMessage);
      resolve(message.result);
    }

    socket.addEventListener('message', onMessage);

    socket.send(JSON.stringify({ version: PROTOCOL_VERSION, id, target: 'server', method }));
  });
}

function connect(url) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);

    const timer = setTimeout(() => {
      socket.close();
      reject(new Error(`Metro не слухає ${url}`));
    }, CONNECT_TIMEOUT_MS);

    socket.addEventListener('open', () => {
      clearTimeout(timer);
      resolve(socket);
    });

    socket.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new Error(`Metro не слухає ${url}`));
    });
  });
}

// One attempt: connect, ask who is connected, broadcast. Returns how many apps
// the reload went to, or null when the dev server itself is not up yet.
async function attempt(url) {
  let socket;

  try {
    socket = await connect(url);
  } catch {
    return null;
  }

  try {
    // `getpeers` counts everyone but us, so a lone CLI reads as zero apps.
    const peers = await request(socket, 'getpeers');
    const count = Object.keys(peers ?? {}).length;

    if (count === 0) return 0;

    // No id and no target: that is what makes Metro treat it as a broadcast
    // rather than as a request addressed to the server.
    socket.send(JSON.stringify({ version: PROTOCOL_VERSION, method: 'reload' }));

    // The send is asynchronous; closing straight away can drop the frame.
    await sleep(100);

    return count;
  } finally {
    socket.close();
  }
}

/**
 * @param {{ host?: string, port?: number, waitMs?: number, log?: (line: string) => void }} options
 * @returns {Promise<number>} apps the reload reached; 0 when nobody was listening
 */
export async function reloadConnectedApps({
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
  waitMs = 0,
  log = () => {},
} = {}) {
  const url = `ws://${host}:${port}/message`;
  const deadline = Date.now() + waitMs;

  // Each state is announced once, so a long wait does not fill the terminal.
  let announced = null;

  for (;;) {
    const reached = await attempt(url);

    if (reached) return reached;

    if (Date.now() >= deadline) return 0;

    const state = reached === null ? 'Чекаю на Metro…' : 'Чекаю на застосунок на телефоні…';

    if (state !== announced) {
      announced = state;
      log(state);
    }

    await sleep(RETRY_DELAY_MS);
  }
}

function parseArgs(argv) {
  const options = { host: DEFAULT_HOST, port: DEFAULT_PORT, waitMs: 0 };

  for (let i = 0; i < argv.length; i += 1) {
    const [flag, inline] = argv[i].split('=');
    const value = inline ?? argv[++i];

    if (flag === '--host') options.host = value;
    else if (flag === '--port') options.port = Number(value);
    else if (flag === '--wait') options.waitMs = Number(value) * 1000;
    else throw new Error(`Невідомий аргумент: ${argv[i]}`);
  }

  return options;
}

// Only when run as a command; `dev.mjs` imports the function instead.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const options = parseArgs(process.argv.slice(2));
  const reached = await reloadConnectedApps({ ...options, log: (line) => console.log(line) });

  if (reached === 0) {
    console.error(
      `Нікого перезавантажувати: на ${options.host}:${options.port} або не запущений ` +
        'Metro, або до нього не під\'єднаний застосунок. Відкрий проєкт на телефоні ' +
        'або додай --wait 60, щоб зачекати.'
    );
    process.exit(1);
  }

  console.log(`Перезавантажено застосунків: ${reached}.`);
}
