import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { saveSessionCookies } from '@/lib/bff/session';
import { v1Client } from '@/lib/clients/v1';
import { LoginResponse, UserProfileResponse } from '@/lib/bff/types';

export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = getAuthedHeaders(req);
  const result = await v1Client.get<UserProfileResponse>('/core/v1/onboarding/info', headers);
  res.status(200).json(result.data);
});