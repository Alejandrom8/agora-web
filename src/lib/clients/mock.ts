// lib/clients/agora.ts
import { ApiClient } from '@/lib/apiClient';

export const mockClient = new ApiClient({
  baseUrl: 'https://mock.echoapi.com/mock/527644d7e802000',
  timeout: 8000,
  retries: 1,
  onError: (e, ctx) => {
    console.error(`[MockAPI] ${ctx.method} ${ctx.url}:`, e.status, e.details);
  },
});