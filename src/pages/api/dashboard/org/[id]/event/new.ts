import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { CreateEventResult } from '@/lib/v1/types';

export default createHandler(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { 
    title,
    startDate,
    startTime,
    endDate,
    endTime,
    location,
    description,
    capacity,
    is_public,
  } = req.body;
  const start_at = new Date(`${startDate}T${startTime}:00Z`).toISOString();
  const end_at = new Date(`${endDate}T${endTime}:00Z`).toISOString();
  const result = await v1Client.post<CreateEventResult>(`/dashboard/v1/events`, {
    organization_id: id,
    name: title,
    description,
    location,
    start_at,
    end_at,
    capacity: capacity || 0,
    is_public,
  }, getAuthedHeaders(req));

  if (result.error) {
    res.status(result?.error?.code).json({ success: false, message: result?.error?.message });
    return;
  }

  res.status(200).json(result.data);
});