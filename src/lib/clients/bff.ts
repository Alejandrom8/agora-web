// lib/clients/bff.ts
import { ApiClient } from '@/lib/apiClient';

// Detecta entorno para resolver base URL (SSR vs CSR)
function getBaseUrl() {
  if (typeof window !== 'undefined') return ''; // rutas relativas en el browser
  // En SSR y en build usa una absoluta (configúralo en .env)
  // Ej: NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

export const bffClient = new ApiClient({
  baseUrl: getBaseUrl(),         // '' en CSR → usa /api/... tal cual
  timeout: 8000,
  retries: 1,
  onError: (e, ctx) => {
    console.error(`[BFF] ${ctx.method} ${ctx.url}`, e.status, e.details);
  },
});

// Opcional: si en algún flujo necesitas “token app” para rutas internas:
// bffClient.setToken('...'); // Normalmente NO para BFF (cookies HttpOnly bastan)