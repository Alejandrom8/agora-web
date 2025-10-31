import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import {
  Box,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  IconButton,
  MenuItem,
  InputAdornment,
  Tooltip,
  Snackbar,
  Alert,
  Container,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
//import EventRounded from '@mui/icons-material/EventRounded';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import ImageRounded from '@mui/icons-material/ImageRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import PublicRounded from '@mui/icons-material/PublicRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
//import LocalOfferRounded from '@mui/icons-material/LocalOfferRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import { ProtectedLayout } from '@/components/Dashboard/DashboardLayout';
import { bffClient } from '@/lib/clients/bff';
import { useRouter } from 'next/router';
import { withAuth } from '@/lib/withAuth';
import { Event } from '@/lib/v1/types';
import { AuthHeader } from '@/lib/v1/utils';

// -----------------------
// Tipos
// -----------------------

//type PriceType = 'free' | 'paid';

interface EventCreateForm {
  title: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string; // YYYY-MM-DD
  endTime: string; // HH:mm
  timezone: string;
  location?: string; // físico o virtual
  description?: string;
  coverUrl?: string;
  capacityType: 'unlimited' | 'limited';
  capacity?: number;
  is_public?: boolean;
}

const today = new Date();
const isoDay = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);

const initialForm: EventCreateForm = {
  title: '',
  startDate: isoDay,
  startTime: '15:30',
  endDate: isoDay,
  endTime: '16:30',
  timezone: 'America/Mexico_City',
  location: '',
  description: '',
  coverUrl: '/art_1.png',
  capacityType: 'unlimited',
  capacity: undefined,
  is_public: true,
};

interface NewEventWizardPageProps {
  authHeader: AuthHeader;
}

function NewEventWizardPage({ authHeader }: NewEventWizardPageProps): React.JSX.Element {
  const [form, setForm] = React.useState<EventCreateForm>(initialForm);
  const [saving, setSaving] = React.useState(false);
  const router = useRouter();
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [coverPicture, setCoverPicture] = React.useState<File | undefined>();
  const [previewUrl, setPreviewUrl] = React.useState<string | undefined>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!coverPicture) {
      setPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(coverPicture);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverPicture]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverPicture(file);
    }
    // reset input so the same file can be selected again if needed
    if (e.target) e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverPicture(file);
    }
  };

  const handleChange = <K extends keyof EventCreateForm>(key: K, value: EventCreateForm[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const handleCreate = async () => {
    try {
      setSaving(true);
      const payload = { ...form };
      const orgId = router.query.id;
      const result = await bffClient.post<Event>(`/api/dashboard/org/${orgId}/event/new`, payload);
      Sentry.logger.info('Nuevo evento creado', payload);
      const formData = new FormData();
      if (coverPicture) {
        formData.append('file', coverPicture);
      }
      await fetch(`/dashboard/v1/events/${result.id}/cover`, {
        method: 'PUT',
        headers: { ...authHeader },
        body: formData,
      });
      Sentry.logger.info('Portada del evento subida', payload);
      setToast({ open: true, message: 'Evento creado con éxito', severity: 'success' });
      router.push(`/org/${orgId}`);
    } catch {
      setToast({ open: true, message: 'No se pudo crear el evento', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const tzOptions = [
    { id: 'America/Mexico_City', label: 'GMT-06 • Ciudad de México' },
    { id: 'America/Bogota', label: 'GMT-05 • Bogotá' },
    { id: 'America/Los_Angeles', label: 'GMT-08 • Los Ángeles' },
    { id: 'UTC', label: 'UTC' },
  ];

  return (
    <ProtectedLayout title="Nuevo evento">
      <Box sx={{ minHeight: '90vh', display: 'grid', placeItems: 'center' }}>
        <Box sx={{ width: '70vw', py: { xs: 6, md: 4 } }}>
          <Container maxWidth="lg">
            <Stack spacing={4}>
              {/* Header */}
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                spacing={2}
              >
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    Crear evento
                  </Typography>
                  <Typography color="text.secondary">
                    Configura portada, fechas, opciones y publicación.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <ToggleButtonGroup
                    value={form.is_public}
                    exclusive
                    onChange={(e, val) => handleChange('is_public', val)}
                    size="small"
                    sx={{ alignSelf: 'flex-end' }}
                  >
                    <ToggleButton value={true} aria-label="Público" sx={{ border: 'none' }}>
                      <Tooltip title="Evento público">
                        <PublicRounded fontSize="small" color={form.is_public ? 'primary' : 'disabled'} />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value={false} aria-label="Privado" sx={{ border: 'none' }}>
                      <Tooltip title="Evento privado">
                        <LockRounded fontSize="small" color={!form.is_public ? 'primary' : 'disabled'} />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Button variant="outlined" onClick={() => history.back()}>
                    Cancelar
                  </Button>
                  <Button variant="contained" onClick={handleCreate} disabled={saving}>
                    Crear evento
                  </Button>
                </Stack>
              </Stack>

              {/* Layout principal */}
              <Grid container spacing={3}>
                {/* Columna izquierda — Portada y tema */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <Card
                    sx={{
                      overflow: 'hidden',
                    }}
                  >
                    <Box sx={{ aspectRatio: '4/3', position: 'relative', bgcolor: 'action.hover' }}>
                      <Box
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        sx={{
                          width: '100%',
                          height: '100%',
                          position: 'relative',
                          border: previewUrl ? 'none' : '1px dashed',
                          borderColor: 'divider',
                          cursor: 'pointer',
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple={false}
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                        />
                        {previewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewUrl}
                            alt="Cover preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <Stack
                            height="100%"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                          >
                            <ImageRounded />
                            <Typography color="text.secondary" align="center">
                              Arrastra y suelta una imagen aquí<br />o haz clic para seleccionar
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              Formatos: JPG, PNG, GIF • 1 imagen
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 12,
                          bottom: 12,
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Cambiar imagen">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <ImageRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <CardContent>
                      <Stack spacing={2}>
                        <TextField
                          variant="standard"
                          placeholder="Título del evento"
                          value={form.title}
                          onChange={(e) => handleChange('title', e.target.value)}
                          fullWidth
                          required
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              fontSize: '2rem',
                              fontWeight: 'bold',
                              color: 'text.primary',
                              backgroundColor: 'transparent',
                              border: 'none',
                              outline: 'none',
                              '& input::placeholder': {
                                color: 'text.disabled',
                                opacity: 1,
                              },
                              '&:focus-within': {
                                boxShadow: 'none',
                              },
                            },
                          }}
                          inputProps={{
                            style: { padding: 0 },
                          }}
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Columna derecha — Formulario principal */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Stack spacing={3}>
                    {/* Fechas y zona horaria */}
                    <Card>
                      <CardContent>
                        <Stack spacing={2}>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 7 }}>
                              <TextField
                                type="date"
                                label="Inicio — Fecha"
                                value={form.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 5 }}>
                              <TextField
                                type="time"
                                label="Inicio — Hora"
                                value={form.startTime}
                                onChange={(e) => handleChange('startTime', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 7 }}>
                              <TextField
                                type="date"
                                label="Fin — Fecha"
                                value={form.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, md: 5 }}>
                              <TextField
                                type="time"
                                label="Fin — Hora"
                                value={form.endTime}
                                onChange={(e) => handleChange('endTime', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <FormControl fullWidth>
                                <InputLabel>Zona horaria</InputLabel>
                                <Select
                                  label="Zona horaria"
                                  value={form.timezone}
                                  onChange={(e) =>
                                    handleChange('timezone', e.target.value as string)
                                  }
                                  startAdornment={
                                    <InputAdornment position="start">
                                      <PublicRounded />
                                    </InputAdornment>
                                  }
                                >
                                  {tzOptions.map((t) => (
                                    <MenuItem key={t.id} value={t.id}>
                                      {t.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Ubicación y descripción */}
                    <Card>
                      <CardContent>
                        <Stack spacing={2}>
                          <TextField
                            label="Agregar ubicación del evento"
                            placeholder="Ubicación física o enlace virtual"
                            value={form.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            fullWidth
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PlaceRounded />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            label="Agregar descripción"
                            value={form.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            fullWidth
                            multiline
                            minRows={3}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DescriptionRounded />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Opciones del evento */}
                    <Card>
                      <CardContent>
                        <Stack spacing={2}>
                          {/* Entradas
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Chip icon={<LocalOfferRounded />} label="Entradas" variant="outlined" />
                            <FormControl size="small" sx={{ minWidth: 140 }}>
                              <InputLabel>Tipo</InputLabel>
                              <Select label="Tipo" value={form.priceType} onChange={(e) => handleChange('priceType', e.target.value as PriceType)}>
                                <MenuItem value="free">Gratis</MenuItem>
                                <MenuItem value="paid">De pago</MenuItem>
                              </Select>
                            </FormControl>
                            {form.priceType === 'paid' && (
                              <TextField
                                size="small"
                                label="Precio"
                                type="number"
                                value={form.price ?? ''}
                                onChange={(e) => handleChange('price', e.target.value === '' ? undefined : Number(e.target.value))}
                                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                              />
                            )}
                          </Stack>

                          <Divider flexItem sx={{ my: 1 }} /> */}

                          {/* Requiere aprobación
                          <FormControlLabel
                            control={<Switch checked={form.requiresApproval} onChange={(e) => handleChange('requiresApproval', e.target.checked)} />}
                            label="Requiere aprobación"
                          />

                          <Divider flexItem sx={{ my: 1 }} /> */}

                          {/* Cupo */}
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                          >
                            <Chip icon={<PeopleAltRounded />} label="Cupo" variant="outlined" />
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                              <InputLabel>Tipo</InputLabel>
                              <Select
                                label="Tipo"
                                value={form.capacityType}
                                onChange={(e) =>
                                  handleChange(
                                    'capacityType',
                                    e.target.value as 'unlimited' | 'limited',
                                  )
                                }
                              >
                                <MenuItem value="unlimited">Ilimitado</MenuItem>
                                <MenuItem value="limited">Limitado</MenuItem>
                              </Select>
                            </FormControl>
                            {form.capacityType === 'limited' && (
                              <TextField
                                size="small"
                                type="number"
                                label="Capacidad"
                                value={form.capacity ?? ''}
                                onChange={(e) =>
                                  handleChange(
                                    'capacity',
                                    e.target.value === '' ? undefined : Number(e.target.value),
                                  )
                                }
                                inputProps={{ min: 1 }}
                              />
                            )}
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Acción primaria */}
                    <Card>
                      <CardContent>
                        <Button
                          fullWidth
                          size="large"
                          variant="contained"
                          onClick={handleCreate}
                          disabled={saving}
                        >
                          Crear evento
                        </Button>
                      </CardContent>
                    </Card>
                  </Stack>
                </Grid>
              </Grid>

              <Snackbar
                open={toast.open}
                autoHideDuration={2200}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
              >
                <Alert severity={toast.severity} variant="filled">
                  {toast.message}
                </Alert>
              </Snackbar>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ProtectedLayout>
  );
}

export const getServerSideProps = withAuth((ctx) => {
  return {
    props: {
      authHeader: ctx.authHeader,
    }
  };
});

export default NewEventWizardPage;