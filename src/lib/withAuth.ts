// lib/auth-ssr.ts
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as Sentry from '@sentry/nextjs';
import { AuthHeader, createAuthHeader } from './v1/utils';

/**
 * Helper reutilizable que protege páginas con SSR.
 * Llama a /api/auth/me en el BFF para validar la cookie de sesión.
 */

export type AuthContext = GetServerSidePropsContext & { authHeader: AuthHeader };

export type AuthHandler<P extends Record<string, unknown>> = (
  ctx: AuthContext
) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>;

/**
 * Helper reutilizable que protege páginas con SSR.
 * Llama a /api/auth/me en el BFF para validar la cookie de sesión.
 */
export function withAuth<P extends Record<string, unknown>>(
  handler?: AuthHandler<P>
): GetServerSideProps<P> {
  return async ctx => {
    const authHeader = createAuthHeader(ctx.req);
    if (!authHeader) {
      const nextUrl = encodeURIComponent(ctx.resolvedUrl || '/');
      Sentry.logger.error(`Unauthorized access, redirecting user to ${nextUrl}`);
      return {
        redirect: {
          destination: '/login?next=' + nextUrl,
          permanent: false,
        },
      };
    }

    let next: GetServerSidePropsResult<P>;
    if (typeof handler === 'function') {
      next = await handler({ ...ctx, authHeader });
    } else {
      next = { props: {} as P };
    }

    return next;
  };
}