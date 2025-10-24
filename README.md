# Descripción General

Agora Web es una plataforma moderna desarrollada con Next.js, TypeScript y Material UI, diseñada para conectar founders, inversionistas y asistentes a través de eventos tecnológicos. Permite la gestión completa de eventos, perfiles, roles, categorías, invitaciones y asistentes, con flujos diferenciados para usuarios y administradores.

## Principales Tecnologías
- Next.js (SSR/SSG, API routes)
- React 19
- TypeScript
- Material UI (MUI)
- SWR (data fetching)
- Zod (validación de datos)
- Sentry (monitorización de errores)
- MSW (Mock Service Worker para desarrollo)

## Estructura del Proyecto
- `/src/pages/` — Páginas principales, rutas, y API endpoints.
- `/src/components/` — Componentes reutilizables (Navbar, Hero, Forms, etc).
- `/src/lib/` — Lógica de clientes API, utilidades y helpers.
- `/src/hooks/` — Custom hooks para sesión y lógica de usuario.
- `/public/` — Archivos estáticos, manifest, favicon, robots.txt, sitemap.xml.

## Funcionalidades Clave
- Autenticación y registro de usuarios (NextAuth, API personalizada)
- Creación y gestión de eventos (admins)
- Definición de agenda, roles y categorías
- Invitaciones y validación por código
- Visualización de eventos y perfiles
- Mock de endpoints para desarrollo local
- Política de privacidad y términos legales

---

# Guía de Instalación y Primer Uso

## 1. Requisitos previos
- Node.js >= 18
- npm >= 9

## 2. Instalación
Clona el repositorio y entra en la carpeta:

```bash
git clone https://github.com/Alejandrom8/agora-web.git
cd agora-web
```

Instala las dependencias:

```bash
npm install
```

## 3. Variables de entorno
Crea un archivo `.env.development` y `.env.production` en la raíz. Ejemplo:

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
V1_API_KEY=tu_api_key_development
NEXT_PUBLIC_API_MOCKING=enabled # Para activar mocks con MSW
```

## 4. Mock Service Worker (MSW)
Para desarrollo, inicializa el worker:

```bash
npx msw init public
```

## 5. Primer ejecución
Inicia el servidor de desarrollo:

```bash
npm run dev
```

Accede a `http://localhost:3000` en tu navegador.

## 6. Lint y formato
Para revisar y corregir estilo de código:

```bash
npm run lint
npm run format
```

## 7. Build y producción
Para compilar y correr en producción:

```bash
npm run build
npm run start
```

---

Para dudas, revisa la documentación interna o contacta al equipo de Agora.