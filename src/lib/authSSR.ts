// lib/auth-ssr.ts
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import * as Sentry from '@sentry/nextjs';

/**
 * Helper reutilizable que protege páginas con SSR.
 * Llama a /api/auth/me en el BFF para validar la cookie de sesión.
 */
export function withAuth<P extends { [key: string]: any }>(
  handler?: (ctx: GetServerSidePropsContext, user: any) => Promise<GetServerSidePropsResult<P>>
): GetServerSideProps<P> {
  return async (ctx: GetServerSidePropsContext) => {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/auth/me`, {
      headers: { cookie: ctx.req.headers.cookie || '' },
    });

    if (res.status === 401) {
      const loginUrl = `/login?next=${encodeURIComponent(ctx.resolvedUrl)}`;
      Sentry.logger.error(`Unauthorized access, redirecting user to ${loginUrl}`);
      return {
        redirect: {
          destination: loginUrl,
          permanent: false,
        },
      };
    }

    const user = await res.json().catch(() => null);

    if (handler) {
      return handler(ctx, user);
    }

    return {
      props: { user } as unknown as P,
    };
  };
}