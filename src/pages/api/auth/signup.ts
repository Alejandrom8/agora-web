import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { SignUpResponse } from '@/lib/v1/types';

export default createHandler(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password, user_name } = req.body;
  await v1Client.post<SignUpResponse>('/accounts/api/v1/emails/signup', {
    email,
    password,
    user_name,
    role: 'default'
  });
  res.status(200).json({ success: true, message: 'User created' });
});