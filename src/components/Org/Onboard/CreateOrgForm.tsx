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
  Snackbar,
} from '@mui/material';
import TypoLogo from '@/components/App/TypoLogo';
import { ApiError } from '@/lib/apiClient';
import { Organization } from '@/lib/v1/types';
import AvatarUploader from '@/components/Form/AvatarUploader';
import { bffClient } from '@/lib/clients/bff';
import { CreateOrg } from '@/lib/bff/types';

const panelSx: SxProps<Theme> = () => ({
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

function toOrgIdentifier(name: string) {
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
  const [orgWebsite, setWebsite] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [ok, setOk] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const result = await bffClient.post<CreateOrg>('/api/dashboard/org/create', {
        name: orgName,
        description: orgName,
        website: orgWebsite,
      });
      onOrgCreationSuccess?.(result.data as Organization);
      setOk(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Hubo un error al crear tu organización');
      }
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    setOrgIdentifier(toOrgIdentifier(orgName));
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
                <AvatarUploader onFileUpload={(f) => console.log(f)} />

                {error && (
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                )}

                <TextField
                  label="Nombre de tu organización"
                  placeholder="Nombre de tu organización"
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
                  label="Sitio web"
                  placeholder="Sitio Web"
                  value={orgWebsite}
                  onChange={(e) => setWebsite(e.target.value)}
                  fullWidth
                  required
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

                <Stack direction="column" spacing={2}>
                  <Button type="submit" size="large" variant="contained" disabled={submitting}>
                    {submitting ? 'Creando tu organización...' : 'Crear'}
                  </Button>
                  <Button size="large" color="primary" variant="outlined" disabled={submitting}>
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Snackbar
        open={ok}
        autoHideDuration={2500}
        onClose={() => setOk(false)}
        message="Organización creada... Redirigiendo"
      />
    </Box>
  );
}

export default CreateOrgForm;
