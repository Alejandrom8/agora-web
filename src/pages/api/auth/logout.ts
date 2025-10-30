import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/lib/bff/handler';
import { clearSessionCookies } from '@/lib/bff/session';

export default createHandler(['DELETE'], async (req: NextApiRequest, res: NextApiResponse) => {
  clearSessionCookies(res);
  res.status(200).json({ success: true, message: 'Logout successful' });
});