import nookies from 'nookies';

export type AuthHeader = { Authorization: string };

export function createAuthHeader(req): AuthHeader | null {
  const cookies = nookies.get({ req });
  const token = cookies.token;
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
  };
}