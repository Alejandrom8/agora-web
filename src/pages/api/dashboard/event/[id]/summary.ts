import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { GetEventStatsResult } from '@/lib/v1/types';

export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const result = await v1Client.get<GetEventStatsResult>(
    `/dashboard/v1/analytics/events/${id}/summary`,
    getAuthedHeaders(req),
  );

  if (result.error) {
    res.status(result?.error?.code).json({ success: false, message: result?.error?.message });
    return;
  }

  res.status(200).json(result.data);
});
