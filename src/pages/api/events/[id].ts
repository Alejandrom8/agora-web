import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { EventResponse } from '@/lib/bff/types';

/**
 * Endpoint para obtener un evento individual por ID
 * Requiere autenticación
 */
export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  const headers = getAuthedHeaders(req);
  const result = await v1Client.get<EventResponse>(`/dashboard/v1/events/${id}`, headers);
  res.status(200).json(result.data);
});

