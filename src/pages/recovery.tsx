import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import Head from 'next/head';
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Button,
  Link as MLink,
  Card,
  CardContent,
  InputAdornment,
  Alert,
} from '@mui/material';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import { useRouter } from 'next/navigation';
import TypoLogo from '@/components/App/TypoLogo';
import { login } from '@/hooks/useSession';

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

// Simple email/password validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RecoveryPage(): React.JSX.Element {
  const [email, setEmail] = React.useState('');
  const [password] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un correo válido.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      //enqueueSnackbar('Inicio de sesión exitoso', { variant: 'success' });
      router.push('/events');
    } catch (err) {
      Sentry.logger.error(JSON.stringify(err));
      setError('No pudimos iniciar sesión. Inténtalo de nuevo.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Agora | Password Recovery</title>
        <meta
          name="description"
          content="Inicia sesión en Agora para crear y descubrir eventos tecnológicos."
        />
        <meta
          name="keywords"
          content="Agora, login, acceso, eventos, tecnología, founders, inversionistas"
        />
        <meta name="author" content="Agora Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        {/* Open Graph */}
        <meta property="og:title" content="Agora | Login" />
        <meta
          property="og:description"
          content="Inicia sesión en Agora para crear y descubrir eventos tecnológicos."
        />
        <meta property="og:image" content="https://agora-web-three.vercel.app/og-image.png" />
        <meta property="og:url" content="https://agora-web-three.vercel.app/login" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agora | Login" />
        <meta
          name="twitter:description"
          content="Inicia sesión en Agora para crear y descubrir eventos tecnológicos."
        />
        <meta name="twitter:image" content="https://agora-web-three.vercel.app/og-image.png" />
        <meta name="twitter:site" content="@agora" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
        <Box sx={{ width: '100%', py: { xs: 8, md: 10 }, ...subtleBg }}>
          <Container maxWidth="sm">
            <Stack spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <TypoLogo />
              <Typography variant="h3" fontWeight={900} textAlign="center">
                Recupera tu contraseña
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                Ingresa tu correo electrónico para recuperar tu contraseña, si el correo existe, te
                enviaremos un código de recuperación
              </Typography>
            </Stack>

            <Card sx={panelSx}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
                  {error && (
                    <Alert severity="error" variant="outlined">
                      {error}
                    </Alert>
                  )}

                  <TextField
                    type="email"
                    label="Correo electrónico"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button type="submit" size="large" variant="contained" disabled={submitting}>
                    Continuar
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Stack spacing={1} alignItems="center" sx={{ mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Al continuar aceptas nuestros <MLink href="#/terms">Términos</MLink> y{' '}
                <MLink href="#/privacy">Política de privacidad</MLink>.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
}
