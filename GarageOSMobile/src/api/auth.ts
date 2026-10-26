import type { BotInfo, RequestCodeInput, Session, VerifyCodeInput } from '@/types/domain';

import { request } from './client';

export const CODE_LENGTH = 6;

export const CODE_TTL_MS = 5 * 60_000;

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function getBotInfo(): Promise<BotInfo> {
  return request('GET /auth/bot');
}

export function requestCode(input: RequestCodeInput): Promise<void> {
  return request('POST /auth/request-code', input);
}

export function verifyCode(input: VerifyCodeInput): Promise<Session> {
  return request('POST /auth/verify', input);
}

export function refreshSession(refreshToken: string): Promise<Session> {
  return request('POST /auth/refresh', { refreshToken });
}

export function signOut(): Promise<void> {
  return request('POST /auth/sign-out');
}
