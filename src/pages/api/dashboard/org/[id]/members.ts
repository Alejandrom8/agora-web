import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler, getAuthedHeaders } from '@/lib/bff/handler';
import { v1Client } from '@/lib/clients/v1';
import { ListOrgMembersResult } from '@/lib/v1/types';

export default createHandler(['GET'], async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const result = await v1Client.get<ListOrgMembersResult>(
    `/dashboard/v1/organization-members?organization_id=${id}`,
    getAuthedHeaders(req),
  );

  if (result.error) {
    res.status(result?.error?.code).json({ success: false, message: result?.error?.message });
    return;
  }

  res.status(200).json(result.data);
});
