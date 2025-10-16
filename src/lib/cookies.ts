// lib/cookies.ts
import type { NextApiResponse, NextApiRequest } from 'next';

// ---- Constantes de configuración ----
const DEFAULT_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
};

// ---- Tipos ----
export type CookieOptions = Partial<{
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'Lax' | 'Strict' | 'None';
  maxAge: number;
  domain?: string;
}>;

/**
 * Serializa una cookie con los parámetros seguros por defecto.
 */
export function serializeCookie(name: string, value: string, options: CookieOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (opts.maxAge) cookie += `; Max-Age=${opts.maxAge}`;
  if (opts.domain) cookie += `; Domain=${opts.domain}`;
  if (opts.path) cookie += `; Path=${opts.path}`;
  if (opts.httpOnly) cookie += `; HttpOnly`;
  if (opts.secure) cookie += `; Secure`;
  if (opts.sameSite) cookie += `; SameSite=${opts.sameSite}`;

  return cookie;
}

/**
 * Crea una cookie de autenticación segura (token o refresh)
 */
export function createAuthCookie(name: string, value: string, maxAgeSeconds: number): string {
  return serializeCookie(name, value, { maxAge: maxAgeSeconds });
}

/**
 * Borra una cookie inmediatamente.
 */
export function clearCookie(name: string): string {
  return serializeCookie(name, '', { maxAge: 0 });
}

/**
 * Aplica una o más cookies al header de respuesta.
 */
export function setCookies(res: NextApiResponse, cookies: string[]) {
  res.setHeader('Set-Cookie', cookies.filter(Boolean));
}

/**
 * Lee una cookie individual desde el request.
 */
export function getCookie(req: NextApiRequest, name: string): string | undefined {
  const cookies = req.headers.cookie;
  if (!cookies) return undefined;

  const match = cookies
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${name}=`));
  if (!match) return undefined;

  return decodeURIComponent(match.split('=')[1]);
}

/**
 * Lee todas las cookies de un request como objeto.
 */
export function parseCookies(req: NextApiRequest): Record<string, string> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...v] = c.trim().split('=');
      return [decodeURIComponent(key), decodeURIComponent(v.join('='))];
    })
  );
}