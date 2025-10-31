import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { CategoriesResponse } from '@/lib/bff/types';
import { buildUrl } from '@/lib/queryParams';

export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const headers = getAuthedHeaders(req);
  
  const url = buildUrl('/dashboard/v1/categories', req.query);
  
  const result = await v1Client.get<CategoriesResponse>(url, headers);
  res.status(200).json(result.data);
});

