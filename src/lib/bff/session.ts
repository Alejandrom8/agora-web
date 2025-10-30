import { createAuthCookie, setCookies } from '@/lib/cookies';
import { SessionTokens } from '../v1/types';

/**
 * Guarda cookies de sesión de forma estándar.
 */
export function saveSessionCookies(res: any, tokens: SessionTokens) {
  const cookies = [
    createAuthCookie('token', tokens.jwt, 60 * 60 * 24 * 7), // 1 semana
  ];

  if (tokens.refresh_token) {
    cookies.push(createAuthCookie('refresh', tokens.refresh_token, 60 * 60 * 24 * 30)); // 1 mes
  }

  setCookies(res, cookies);
}

/**
 * Limpia las cookies de sesión
 */
export function clearSessionCookies(res: any) {
  const expired = [
    createAuthCookie('token', '', 0),
    createAuthCookie('refresh', '', 0),
  ];
  setCookies(res, expired);
}