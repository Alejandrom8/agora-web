// lib/clients/agora.ts
import { ApiClient } from '@/lib/apiClient';

export const v1Client = new ApiClient({
  baseUrl: 'https://development.agorahub.app',
  timeout: 8000,
  retries: 1,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': 'pk_live_7e6b8db20e410eaa97684424_CFo2DeQtu_d6sZcKEZAvRulaKfSHgObvlBcMifwvw3TSaat_UN60oh9L_cqESZor',
  },
  onError: (e, ctx) => {
    console.error(`[AgoraAPI] ${ctx.method} ${ctx.url}:`, e.status, e.details);
  },
});