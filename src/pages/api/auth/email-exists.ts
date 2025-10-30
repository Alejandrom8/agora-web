import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { EmailExistsResponse } from '@/lib/v1/types';

export default createHandler(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body;
  let exists = false;

  try {
    await v1Client.post<EmailExistsResponse>('/accounts/api/v1/users/exist', {
        email,
    });
    exists = true;
  } catch {}

  res.status(200).json({ success: true, exists });
});