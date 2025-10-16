import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/lib/bff/handler';
import { saveSessionCookies } from '@/lib/bff/session';
import { v1Client } from '@/lib/clients/v1';
import { LoginResponse } from '@/lib/bff/types';

export default createHandler(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body;
  const result = await v1Client.post<LoginResponse>('/accounts/api/v1/emails/signin', {
    email,
    password,
  });
  saveSessionCookies(res, result.data);
  res.status(200).json({ success: true, message: 'Login successful' });
});