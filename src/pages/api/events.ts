import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { EventsResponse } from '@/lib/bff/types';
import { buildUrl } from '@/lib/queryParams';

export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = getAuthedHeaders(req);
  
  const url = buildUrl('/dashboard/v1/events', req.query);
  
  const result = await v1Client.get<EventsResponse>(url, headers);
  res.status(200).json(result.data);
});

