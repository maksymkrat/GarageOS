const MIN_LATENCY_MS = 180;
const MAX_LATENCY_MS = 520;

/** Raise above 0 to exercise the UI's error + retry states against the mocks. */
const FAILURE_RATE = 0;

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

function latency(): number {
  return MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS);
}

/**
 * Stands in for an HTTP call: resolves after a realistic delay with a detached
 * copy of the data, so screens can never mutate the store by reference.
 */
export async function request<T>(endpoint: string, resolve: () => T): Promise<T> {
  await new Promise((done) => setTimeout(done, latency()));

  if (Math.random() < FAILURE_RATE) {
    throw new ApiError(`Запит ${endpoint} не вдався`, endpoint, 503);
  }

  return JSON.parse(JSON.stringify(resolve())) as T;
}
