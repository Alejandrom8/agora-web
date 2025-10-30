import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { ProtectedLayout } from '@/components/Dashboard/DashboardLayout';
import { withAuth } from '@/lib/withAuth';
import { useOrg, useOrgEvents } from '@/hooks/useOrg';
import DashboardLoading from '@/components/Dashboard/DashboardLoading';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import OrganizationManagement from '@/components/Dashboard/OrganizationManagement';
import { Organization } from '@/lib/v1/types';
import { useRouter } from 'next/router';

interface AdminPageProps {
  org_id: string;
}

function AdminDashboardPage({ org_id }: AdminPageProps): React.JSX.Element {
  const { organization, isLoading, error: orgError } = useOrg(org_id);
  const { events, isLoading: isEventsLoading } = useOrgEvents(org_id);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateEvent = () => {
    router.push(`/org/${org_id}/event/new`);
  };

  useEffect(() => {
    console.log(organization);
    if (!organization && !isLoading) {
      setError(orgError || 'Hubo un problema al cargar tu organizacion');
    }
  }, [organization, isLoading, orgError]);

  const loading = isLoading || isEventsLoading;

  return (
    <ProtectedLayout title="Tus eventos">
      {loading && <DashboardLoading />}
      {!isLoading && error && (
        <Box>
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        </Box>
      )}
      {!loading && !events?.length && <Box sx={{ 
        width: '100%', height: '100%', 
        display: 'grid', placeItems: 'center' 
      }}>
        <Stack direction={'column'} spacing={4}>
          <Stack direction={'column'} spacing={1} alignItems="center">
            <Typography variant="h4" fontWeight={800}>
              Aún no tienes eventos
            </Typography>
            <Typography variant="h6" color="text.secondary">
              !Empieza creando tu primer evento en Agora!
            </Typography>
          </Stack>
          <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleCreateEvent}>
            Crear mi primer evento
          </Button>
        </Stack>
      </Box>}
      {!isLoading && !error && events && events?.length > 0 && <OrganizationManagement org={organization as Organization} />}
    </ProtectedLayout>
  );
}

export const getServerSideProps = withAuth(async (ctx) => {
  const { id } = ctx.query;
  if (!id) return { notFound: true };
  return {
    props: {
      org_id: id,
    },
  };
});

export default AdminDashboardPage;
