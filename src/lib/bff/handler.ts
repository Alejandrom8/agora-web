import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Envuelve controladores BFF y estandariza manejo de errores/respuestas
 */
export function createHandler(allowedMethods: string[], fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!allowedMethods.includes(req.method as string)) {
        res.status(405).json({ success: false, error: 'Method Not Allowed' });
        return;
    }

    try {
      await fn(req, res);
    } catch (err: any) {
      console.error('[BFF Error]', err);

      const status = err?.status || 500;
      const message = err?.message || 'Internal Server Error';

      res.status(status).json({
        success: false,
        error: message,
        trace_id: err?.trace_id || undefined,
      });
    }
  };
}

export function getAuthedHeaders(req: NextApiRequest) {
  const token = req.cookies.token;
  if (!token) throw Object.assign(new Error('Unauthorized'), { status: 401 });
  return { Authorization: `Bearer ${token}` };
}