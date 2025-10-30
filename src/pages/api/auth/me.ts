import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { UserProfileResponse } from '@/lib/v1/types';

export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = getAuthedHeaders(req);
  const result = await v1Client.get<UserProfileResponse>('/core/v1/users/me', headers);
  res.status(200).json(result.data?.user);
});