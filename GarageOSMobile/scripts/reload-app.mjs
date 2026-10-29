import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8081;

const PROTOCOL_VERSION = 2;

const CONNECT_TIMEOUT_MS = 2_000;
const REPLY_TIMEOUT_MS = 2_000;
const RETRY_DELAY_MS = 1_000;

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

async function attempt(url) {
  let socket;

  try {
    socket = await connect(url);
  } catch {
    return null;
  }

  try {
    const peers = await request(socket, 'getpeers');
    const count = Object.keys(peers ?? {}).length;

    if (count === 0) return 0;

    // No id and no target: that is what makes Metro treat it as a broadcast
    socket.send(JSON.stringify({ version: PROTOCOL_VERSION, method: 'reload' }));

    await sleep(100);

    return count;
  } finally {
    socket.close();
  }
}

export async function reloadConnectedApps({
  host = DEFAULT_HOST,
  port = DEFAULT_PORT,
  waitMs = 0,
  log = () => {},
} = {}) {
  const url = `ws://${host}:${port}/message`;
  const deadline = Date.now() + waitMs;

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
