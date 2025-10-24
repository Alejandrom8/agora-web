// lib/clients/agora.ts
import { ApiClient } from '@/lib/apiClient';
import * as Sentry from '@sentry/nextjs';

export const v1Client = new ApiClient({
  baseUrl: 'https://development.agorahub.app',
  timeout: 8000,
  retries: 1,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.V1_API_KEY || '',
  },
  onError: (e, ctx) => {
    Sentry.logger.error(`[AgoraAPI] ${ctx.method} ${ctx.url}:`, e.status, e.details);
  },
});