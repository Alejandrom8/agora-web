// hooks/useSession.ts
import useSWR, { mutate } from 'swr';
import { bffClient } from '@/lib/clients/bff';
import { EmailExistsResponse } from '@/lib/clients/types';
import { UserProfile } from '@/lib/v1/types';

export function useSession() {
  const { data, error, isLoading } = useSWR<UserProfile>('/api/auth/me');
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

type SignUpInput = {
  email: string;
  password: string;
  user_name: string;
};

export async function signUp(input: SignUpInput) {
  await bffClient.post('/api/auth/signup', input);
}

export async function verifyEmail(email: string, code: string) {
  await bffClient.post('/api/auth/activate', { email, code });
  await mutate('/api/auth/me'); // refresca la sesión cacheada
}

export async function emailExists(email: string): Promise<boolean> {
  const response = await bffClient.post<EmailExistsResponse>('/api/auth/email-exists', { email });
  return response.exists;
}