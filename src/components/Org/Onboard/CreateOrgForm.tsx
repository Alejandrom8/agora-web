// pages/verification.tsx
import * as React from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  SxProps,
  Theme,
  alpha,
  Alert,
  Container,
} from '@mui/material';
import TypoLogo from '@/components/App/TypoLogo';
import { mockClient } from '@/lib/clients/mock';
import { ApiError } from '@/lib/apiClient';
import { CreateOrgResponse, Organization } from '@/lib/bff/types';

const panelSx: SxProps<Theme> = (t) => ({
  borderRadius: 2,
  backgroundImage: 'none',
  border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
  boxShadow: `0 10px 30px ${alpha('#000', 0.35)}`,
  backdropFilter: 'blur(8px)',
});

const subtleBg: SxProps<Theme> = (t) => ({
  backgroundImage: `radial-gradient(1200px 800px at 80% -10%, ${alpha(t.palette.info.main, 0.06)} 0%, transparent 60%),
                     radial-gradient(1000px 600px at -10% 120%, ${alpha(t.palette.primary.main, 0.05)} 0%, transparent 60%)`,
});

function toOrgIdentirier(name: string) {
    return name.trim().replace(/\s/g, '-').toLowerCase();
}

type CreateOrgFormProps = {
    onOrgCreationSuccess: (input: Organization) => any;
};

function CreateOrgForm({ onOrgCreationSuccess }: CreateOrgFormProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [orgName, setOrgName] = React.useState<string>('');
  const [orgIdentifier, setOrgIdentifier] = React.useState<string>('');
  const [orgDescription, setOrgDescription] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        setSubmitting(true);
        const result = await mockClient.post<CreateOrgResponse>('/org-create', { 
            name: orgName, 
            description: orgName, 
            identifier: orgIdentifier 
        });
        console.log('ORG CREATION', result);
        onOrgCreationSuccess?.(result.data as Organization);
    } catch(error) {
        if (error instanceof ApiError) {
            setError(error.message);
        }
        setError('Hubo un error al crear tu organización');
    } finally {
        setSubmitting(false);
    }
  };

  React.useEffect(() => {
    setOrgIdentifier(toOrgIdentirier(orgName));
  }, [orgName]);

  return (
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
      <Box sx={{ width: '100%', py: { xs: 8, md: 10 }, ...subtleBg }}>
        <Container maxWidth="sm">
          <Stack spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <TypoLogo />
            <Typography variant="h3" fontWeight={900} textAlign="center">
              Crea tu organización
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Tu código de invitación ha sido verificado exitosamente. Ahora puedes proceder a crear
              tu organización.
            </Typography>
          </Stack>

          <Card sx={panelSx}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack component="form" spacing={2} onSubmit={onSubmit} noValidate>
                {error && (
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Nombre de la organización"
                  placeholder="Nombre de la organización"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  fullWidth
                  required
                />

                <TextField
                  label="Identificador"
                  placeholder="ID"
                  value={orgIdentifier}
                  onChange={(e) => setOrgIdentifier(e.target.value)}
                  fullWidth
                  required
                  disabled
                />

                <TextField
                  label="Breve descripción"
                  placeholder="Breve descripción"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />

                <Button type="submit" size="large" variant="contained" disabled={submitting}>
                  {submitting ? 'Creando organización...' : 'Crear organización'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

export default CreateOrgForm;
