import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/lib/bff/handler';
import { saveSessionCookies } from '@/lib/bff/session';
import { v1Client } from '@/lib/clients/v1';
import { SessionTokens, VerifiyEmailResponse } from '@/lib/bff/types';

export default createHandler(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, code } = req.body;
  const result = await v1Client.post<VerifiyEmailResponse>('/accounts/api/v1/emails/activate', {
    email,
    code
  });
  saveSessionCookies(res, result.data as SessionTokens);
  res.status(200).json({ success: true, message: 'Email verified successfully' });
});