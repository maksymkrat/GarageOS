import Constants from 'expo-constants';
import { File } from 'expo-file-system';

const API_PORT = 5101;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly endpoint: string,
    readonly status = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function resolveBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${API_PORT}`;

  throw new ApiError(
    'Невідома адреса сервера. Задайте EXPO_PUBLIC_API_URL.',
    'resolveBaseUrl',
    0
  );
}

export const baseUrl = resolveBaseUrl();

// Only the local path. The file name and mime type are read off the file
// itself, so there is one source for them instead of two that can disagree.
export interface UploadFile {
  uri: string;
}

function split(endpoint: string): { method: string; path: string } {
  const gap = endpoint.indexOf(' ');
  if (gap === -1) throw new ApiError(`Некоректний ендпойнт: ${endpoint}`, endpoint, 0);

  return { method: endpoint.slice(0, gap), path: endpoint.slice(gap + 1) };
}

async function toApiError(response: Response, endpoint: string): Promise<ApiError> {
  try {
    const problem = await response.json();
    const detail = typeof problem?.detail === 'string' ? problem.detail : null;
    const instance = typeof problem?.instance === 'string' ? problem.instance : endpoint;

    if (detail) return new ApiError(detail, instance, response.status);
  } catch {
  }

  return new ApiError(`Запит ${endpoint} не вдався (${response.status})`, endpoint, response.status);
}

// `fetch` rejects for everything that happens before a response exists: no
// route to the host, a refused connection, a body the platform could not read.
// Those are different problems with different fixes, so the underlying text is
// carried through instead of being replaced by a guess about the network.
function transportError(cause: unknown, endpoint: string): ApiError {
  const detail = cause instanceof Error ? cause.message : String(cause);

  return new ApiError(
    `Немає зв'язку з сервером (${baseUrl}): ${detail}. ` +
      'Перевірте, чи запущений API і чи телефон у тій самій мережі.',
    endpoint,
    0
  );
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

// Set by the session: swaps an expired access token for a fresh one and
// answers with it, or with null when the session itself is over.
type UnauthorizedHandler = () => Promise<string | null>;

let onUnauthorized: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  onUnauthorized = handler;
}

// A 401 on the way in is worth one silent retry — the access token lives
// fifteen minutes and the session fourteen hours, so most of them mean
// nothing more than "the token aged". The auth endpoints are excluded: a
// refresh that answers 401 is the session ending, and retrying it would
// only ask again (ADR-0028).
async function renewed(path: string, status: number, retried: boolean): Promise<string | null> {
  if (status !== 401 || retried || onUnauthorized === null) return null;
  if (path.startsWith('/auth/')) return null;

  return onUnauthorized();
}

// expo-image fetches the URL itself, so a protected image needs the token
// inside the source rather than around it.
export function authorizedSource(path: string): { uri: string; headers?: Record<string, string> } {
  return {
    uri: `${baseUrl}${path}`,
    ...(accessToken === null ? null : { headers: { Authorization: `Bearer ${accessToken}` } }),
  };
}

export async function request<T>(endpoint: string, body?: unknown, retried = false): Promise<T> {
  const { method, path } = split(endpoint);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? null : { 'Content-Type': 'application/json' }),
        ...(accessToken === null ? null : { Authorization: `Bearer ${accessToken}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    throw transportError(cause, endpoint);
  }

  if (!response.ok) {
    if ((await renewed(path, response.status, retried)) !== null) {
      return request<T>(endpoint, body, true);
    }

    throw await toApiError(response, endpoint);
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// Multipart, not JSON: the body is a file. The Content-Type header is left to
// fetch on purpose — setting it by hand drops the multipart boundary, and the
// server then reads an empty form.
export async function upload<T>(endpoint: string, file: UploadFile, retried = false): Promise<T> {
  const { method, path } = split(endpoint);

  const form = new FormData();

  // Not React Native's `{ uri, name, type }` part. Expo replaces the global
  // `fetch` with its own (unless EXPO_PUBLIC_USE_RN_FETCH is set), and that
  // encoder takes a string, a Blob, or something with `bytes()` — a `uri` part
  // throws `Unsupported FormDataPart implementation` while the body is built,
  // before anything leaves the device, which reads on screen as "no connection
  // to the server". `File` from expo-file-system implements Blob and carries
  // its own name and mime type, so the part gets a filename and ASP.NET binds
  // it as IFormFile (ADR-0026).
  form.append('file', new File(file.uri) as unknown as Blob);

  let response: Response;

  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(accessToken === null ? null : { Authorization: `Bearer ${accessToken}` }),
      },
      body: form,
    });
  } catch (cause) {
    throw transportError(cause, endpoint);
  }

  if (!response.ok) {
    if ((await renewed(path, response.status, retried)) !== null) {
      return upload<T>(endpoint, file, true);
    }

    throw await toApiError(response, endpoint);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
