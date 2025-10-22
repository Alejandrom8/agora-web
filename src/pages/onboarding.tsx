// pages/profile/create.tsx
import * as React from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import RocketLaunchRoundedIcon from '@mui/icons-material/RocketLaunchRounded';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

// ------------ Tipos ------------
type Visibility = 'public' | 'private';
type RoleType = 'founder' | 'investor' | 'general';

type FormValues = {
  personal_info: {
    full_name: string;
    headline: string;
    bio: string;
    location: string;
    profile_picture_url: string;
  };
  social_links: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  profiles: {
    type: RoleType;
    data:
      | {
          industry: string;
          pitch: string;
          stage: string;
          startup_name: string;
          website: string;
        }
      | {
          firm_name: string;
          investment_focus: string[];
          preferred_stage: string;
          ticket_size_usd: { min: number; max: number };
        }
      | {
          experience_level: string;
          interests_areas: string[];
          looking_for: string[];
          occupation: string;
          organization: string;
        };
  }[];
  interests: string[];
  visibility: Visibility;
};

// ------------ Defaults con tu JSON ------------
const defaultValues: FormValues = {
  personal_info: {
    full_name: 'Rafael Zamora',
    headline: 'Fundador de Authify | Desarrollador de plataformas SaaS',
    bio:
      'Apasionado por construir soluciones que aceleren el desarrollo de software y potencien la colaboración entre startups y talento técnico.',
    location: 'Ciudad de México, MX',
    profile_picture_url: 'https://cdn.agora.dev/profiles/rafael.jpg',
  },
  social_links: {
    linkedin: 'https://www.linkedin.com/in/rafaelzamora',
    twitter: 'https://twitter.com/rafa_dev',
    instagram: 'https://instagram.com/rafa_dev',
    website: 'https://authify.dev',
  },
  profiles: [
    {
      type: 'founder',
      data: {
        industry: 'Software / DevTools',
        pitch:
          'Estamos construyendo la infraestructura base para que los developers lancen SaaS en minutos, no semanas.',
        stage: 'Early Stage',
        startup_name: 'Authify',
        website: 'https://authify.dev',
      },
    },
    {
      type: 'investor',
      data: {
        firm_name: 'Zamora Capital',
        investment_focus: ['SaaS', 'EdTech', 'AI'],
        preferred_stage: 'Seed / Pre-Seed',
        ticket_size_usd: { min: 10000, max: 50000 },
      },
    },
    {
      type: 'general',
      data: {
        experience_level: 'junior',
        interests_areas: [
          'Inteligencia Artificial',
          'Startups',
          'Sostenibilidad',
          'Networking',
        ],
        looking_for: [
          'Conocer fundadores',
          'Aprender de conferencias',
          'Unirme a proyectos de impacto',
        ],
        occupation: 'Estudiante universitaria',
        organization: 'UNAM - Facultad de Ingeniería',
      },
    },
  ],
  interests: ['Tecnología', 'SaaS', 'Startups', 'Networking', 'Fintech'],
  visibility: 'public',
};

// ------------ Constantes UI ------------
const steps = [
  { key: 'personal', label: 'Personal', icon: <PersonRoundedIcon /> },
  { key: 'social', label: 'Social', icon: <ShareRoundedIcon /> },
  { key: 'roles', label: 'Perfiles', icon: <RocketLaunchRoundedIcon /> },
  { key: 'prefs', label: 'Intereses', icon: <TagRoundedIcon /> },
  { key: 'privacy', label: 'Privacidad', icon: <VisibilityRoundedIcon /> },
  { key: 'review', label: 'Revisión', icon: <CheckCircleRoundedIcon /> },
] as const;

const stages = ['Idea', 'Early Stage', 'Seed', 'Series A+'];
const experienceLevels = ['junior', 'mid', 'senior', 'lead'];
const investorStages = ['Pre-Seed', 'Seed / Pre-Seed', 'Series A', 'Growth'];

// ------------ Página ------------
export default function CreateProfileWizard() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    getValues,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ defaultValues, mode: 'onChange' });

  const [step, setStep] = React.useState(0);
  const [roleTab, setRoleTab] = React.useState<RoleType>('founder');
  const values = watch();

  // índices para perfilar data anidada
  const founderIndex = values.profiles.findIndex((p) => p.type === 'founder');
  const investorIndex = values.profiles.findIndex((p) => p.type === 'investor');
  const generalIndex = values.profiles.findIndex((p) => p.type === 'general');

  // UI: gradiente superior
  const GradientHeader = (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        mb: 3,
        overflow: 'hidden',
        bgcolor: 'transparent',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(1200px 600px at -10% -20%, #FFD54F40, transparent 50%), radial-gradient(900px 500px at 110% -10%, #7C4DFF30, transparent 50%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))',
          pointerEvents: 'none',
        },
        border: () => `1px solid ${alpha('#FFFFFF', 0.12)}`,
        backdropFilter: 'blur(8px) saturate(130%)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {steps[step].icon}
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {steps[step].label}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        Paso {step + 1} de {steps.length}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={((step + 1) / steps.length) * 100}
        sx={{ mt: 2, height: 6, borderRadius: 999 }}
      />
    </Box>
  );

  // Validaciones mínimas por paso
  const validatorsByStep = [
    () => trigger(['personal_info.full_name', 'personal_info.headline']), // Step 0
    () => Promise.resolve(true), // Social (opcional)
    () => Promise.resolve(true), // Roles (completa lo que quieras)
    () => Promise.resolve(true), // Intereses
    () => trigger(['visibility']), // Privacidad
    () => Promise.resolve(true), // Review
  ] as const;

  const onNext = async () => {
    const ok = await validatorsByStep[step]();
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const onBack = () => setStep((s) => Math.max(s - 1, 0));
  const goTo = (n: number) => setStep(n);

  const onSubmit = async (data: FormValues) => {
    // Conectar a tu BFF:
    // await bffClient.post('/api/profile', data);
    console.log('Payload final:', data);
    goTo(steps.length - 1);
  };

  // Helpers de sección
  const Section = ({ title, children, subheader }: { title: string; children: React.ReactNode; subheader?: string }) => (
    <Card variant="outlined" sx={{ overflow: 'hidden' }}>
      <CardHeader title={title} subheader={subheader} />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );

  // -------- Render de cada paso ----------
  const renderStep = () => {
    switch (step) {
      case 0: // Personal
        return (
          <Section title="Información personal" subheader="Comparte cómo quieres que te conozcan en Agora">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Nombre completo"
                  fullWidth
                  {...register('personal_info.full_name', { required: 'Este campo es obligatorio' })}
                  error={!!errors.personal_info?.full_name}
                  helperText={errors.personal_info?.full_name?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Ubicación" fullWidth {...register('personal_info.location')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Headline"
                  fullWidth
                  {...register('personal_info.headline', { required: 'Este campo es obligatorio' })}
                  error={!!errors.personal_info?.headline}
                  helperText={errors.personal_info?.headline?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField label="Bio" fullWidth multiline minRows={4} {...register('personal_info.bio')} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="URL de foto de perfil"
                  fullWidth
                  placeholder="https://"
                  {...register('personal_info.profile_picture_url')}
                />
              </Grid>
            </Grid>
          </Section>
        );

      case 1: // Social
        return (
          <Section title="Redes y enlaces" subheader="Conecta tus perfiles para ampliar tu alcance">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="LinkedIn" fullWidth placeholder="https://" {...register('social_links.linkedin')} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Twitter/X" fullWidth placeholder="https://" {...register('social_links.twitter')} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Instagram" fullWidth placeholder="https://" {...register('social_links.instagram')} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Website" fullWidth placeholder="https://" {...register('social_links.website')} />
              </Grid>
            </Grid>
            <Alert icon={<InfoRoundedIcon />} sx={{ mt: 2 }} severity="info" variant="outlined">
              Consejo: agrega al menos tu LinkedIn o sitio web para mejorar tu visibilidad.
            </Alert>
          </Section>
        );

      case 2: // Roles
        return (
          <Section title="Perfiles" subheader="Completa los roles que te representen">
            <Tabs
              value={roleTab}
              onChange={(_, v) => setRoleTab(v)}
              sx={{
                mb: 2,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
                '& .MuiTabs-indicator': { height: 3 },
              }}
            >
              <Tab value="founder" label="Founder" />
              <Tab value="investor" label="Investor" />
              <Tab value="general" label="General" />
            </Tabs>

            {roleTab === 'founder' && founderIndex >= 0 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Startup"
                    fullWidth
                    {...register(`profiles.${founderIndex}.data.startup_name` as const)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Website" fullWidth {...register(`profiles.${founderIndex}.data.website` as const)} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Industria" fullWidth {...register(`profiles.${founderIndex}.data.industry` as const)} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="stage-label">Etapa</InputLabel>
                    <Controller
                      control={control}
                      name={`profiles.${founderIndex}.data.stage` as const}
                      render={({ field }) => (
                        <Select labelId="stage-label" label="Etapa" {...field}>
                          {stages.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Pitch"
                    fullWidth
                    multiline
                    minRows={3}
                    {...register(`profiles.${founderIndex}.data.pitch` as const)}
                  />
                </Grid>
              </Grid>
            )}

            {roleTab === 'investor' && investorIndex >= 0 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Firma"
                    fullWidth
                    {...register(`profiles.${investorIndex}.data.firm_name` as const)}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="preferred-stage-label">Etapa preferida</InputLabel>
                    <Controller
                      control={control}
                      name={`profiles.${investorIndex}.data.preferred_stage` as const}
                      render={({ field }) => (
                        <Select labelId="preferred-stage-label" label="Etapa preferida" {...field}>
                          {investorStages.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    control={control}
                    name={`profiles.${investorIndex}.data.investment_focus` as const}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={field.value || []}
                        onChange={(_, v) => field.onChange(v)}
                        renderInput={(params) => <TextField {...params} label="Foco de inversión" />}
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
                          ))
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    label="Ticket min (USD)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0 }}
                    {...register(`profiles.${investorIndex}.data.ticket_size_usd.min` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    label="Ticket max (USD)"
                    type="number"
                    fullWidth
                    inputProps={{ min: 0 }}
                    {...register(`profiles.${investorIndex}.data.ticket_size_usd.max` as const, {
                      valueAsNumber: true,
                    })}
                  />
                </Grid>
              </Grid>
            )}

            {roleTab === 'general' && generalIndex >= 0 && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="exp-level-label">Nivel de experiencia</InputLabel>
                    <Controller
                      control={control}
                      name={`profiles.${generalIndex}.data.experience_level` as const}
                      render={({ field }) => (
                        <Select labelId="exp-level-label" label="Nivel de experiencia" {...field}>
                          {experienceLevels.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField label="Ocupación" fullWidth {...register(`profiles.${generalIndex}.data.occupation` as const)} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField label="Organización" fullWidth {...register(`profiles.${generalIndex}.data.organization` as const)} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name={`profiles.${generalIndex}.data.interests_areas` as const}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={field.value || []}
                        onChange={(_, v) => field.onChange(v)}
                        renderInput={(params) => <TextField {...params} label="Áreas de interés" />}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    control={control}
                    name={`profiles.${generalIndex}.data.looking_for` as const}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={field.value || []}
                        onChange={(_, v) => field.onChange(v)}
                        renderInput={(params) => <TextField {...params} label="Buscando" />}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Section>
        );

      case 3: // Intereses
        return (
          <Section title="Intereses globales" subheader="Elige temas para descubrir mejores conexiones">
            <Controller
              control={control}
              name="interests"
              render={({ field }) => (
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={field.value || []}
                  onChange={(_, v) => field.onChange(v)}
                  renderInput={(params) => <TextField {...params} label="Intereses" placeholder="Agrega intereses" />}
                />
              )}
            />
          </Section>
        );

      case 4: // Privacidad
        return (
          <Section title="Privacidad" subheader="Controla quién puede ver tu perfil">
            <RadioGroup
              row
              {...register('visibility', { required: true })}
              defaultValue={values.visibility}
            >
              <FormControlLabel value="public" control={<Radio />} label="Público" />
              <FormControlLabel value="private" control={<Radio />} label="Privado" />
            </RadioGroup>
            <Alert sx={{ mt: 2 }} severity="info" icon={<VisibilityRoundedIcon />}>
              Puedes cambiar la visibilidad en cualquier momento desde tu configuración.
            </Alert>
          </Section>
        );

      case 5: // Review
        return (
          <Section title="Revisión final" subheader="Verifica que todo esté correcto antes de enviar">
            <Stack spacing={2}>
              <Typography variant="subtitle2">Resumen (payload):</Typography>
              <Box
                component="pre"
                sx={{
                  m: 0,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: () => alpha('#FFFFFF', 0.04),
                  border: () => `1px solid ${alpha('#FFFFFF', 0.12)}`,
                  maxHeight: 360,
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(getValues(), null, 2)}
              </Box>
              <Alert icon={<CheckCircleRoundedIcon />} severity="success" variant="outlined">
                ¡Todo listo! Presiona “Guardar perfil” para continuar.
              </Alert>
            </Stack>
          </Section>
        );

      default:
        return null;
    }
  };

  // ------------ Render principal ------------
  return (
    <>
      <Head>
        <title>Crear perfil | Agora</title>
      </Head>

      <Box sx={{ pt: { xs: 2, md: 4 }, pb: 6 }}>
        <Container maxWidth="md">
          {/* Header con degradado y progreso */}
          {GradientHeader}

          {/* Stepper compacto para referencia visual */}
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Stepper activeStep={step} alternativeLabel>
                {steps.map((s) => (
                  <Step key={s.key}>
                    <StepLabel icon={s.icon}>{s.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
            sx={{ '& .MuiCard-root': { backdropFilter: 'blur(6px)' } }}
          >
            {renderStep()}

            <Stack direction="row" spacing={1.5} justifyContent="space-between">
              <Box>
                <Button
                  variant="outlined"
                  onClick={onBack}
                  disabled={step === 0}
                  startIcon={<NavigateBeforeRoundedIcon />}
                >
                  Atrás
                </Button>
              </Box>
              <Stack direction="row" spacing={1.5}>
                {step < steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={onNext}
                    endIcon={<NavigateNextRoundedIcon />}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    endIcon={<CheckCircleRoundedIcon />}
                  >
                    Guardar perfil
                  </Button>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
}