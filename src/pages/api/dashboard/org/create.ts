import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { CreateOrgResponse } from '@/lib/v1/types';

export default createHandler(['POST'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, description, website } = req.body;
  const result = await v1Client.post<CreateOrgResponse>(
    '/dashboard/v1/organizations',
    {
      name,
      description,
      website,
    },
    getAuthedHeaders(req),
  );

  if (result.error) {
    console.log(result.error);
    res.status(result?.error?.code).json({ success: false, message: result?.error?.message });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Organization created successfuly',
    data: result.data,
  });
});
