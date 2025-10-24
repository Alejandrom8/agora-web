// lib/clients/agora.ts
import { ApiClient } from '@/lib/apiClient';
import * as Sentry from '@sentry/nextjs';

export const mockClient = new ApiClient({
  baseUrl: 'https://mock.echoapi.com/mock/527644d7e802000',
  timeout: 8000,
  retries: 1,
  onError: (e, ctx) => {
    Sentry.logger.error(`[MockAPI] ${ctx.method} ${ctx.url}:`, e.status, e.details);
  },
});