// hooks/useSession.ts
import useSWR, { mutate } from 'swr';
import { bffClient } from '@/lib/clients/bff';

export type Me = { id: string; email: string; name?: string };

export function useSession() {
  const { data, error, isLoading } = useSWR<Me>('/api/auth/me');
  return { user: data ?? null, isLoading, isError: !!error };
}

export async function login(email: string, password: string) {
  await bffClient.post('/api/auth/login', { email, password });
  await mutate('/api/auth/me'); // refresca la sesión cacheada
}

export async function logout() {
  await bffClient.post('/api/auth/logout');
  await mutate('/api/auth/me', null, false);
}