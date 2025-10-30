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
  Divider,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import MailOutlineRounded from '@mui/icons-material/MailOutlineRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import { useRouter } from 'next/router';
import TypoLogo from '@/components/App/TypoLogo';
import { emailExists, login } from '@/hooks/useSession';
import Link from 'next/link';
import { createAuthHeader } from '@/lib/v1/utils';

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

function LoginPage(): React.JSX.Element {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isEmailValidated, setIsEmailValidated] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isEmailValidated) {
      if (!isValidEmail(email)) {
        setError('Por favor ingresa un correo válido.');
        return;
      }

      try {
        setSubmitting(true);
        const exists = await emailExists(email);
        if (!exists) {
          setError('No existe una cuenta asociada a este correo.');
          setSubmitting(false);
          return;
        }
        setSubmitting(false);
        setIsEmailValidated(true);
      } catch (err) {
        Sentry.logger.error(JSON.stringify(err));
        setError('No pudimos verificar el correo. Inténtalo de nuevo.');
        setSubmitting(false);
      }
    } else {
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }

      try {
        setSubmitting(true);
        await login(email, password);
        //enqueueSnackbar('Inicio de sesión exitoso', { variant: 'success' });
        const nextUrl = String(router.query?.next || '');
        router.push((nextUrl && nextUrl !== '') ? nextUrl : '/events');
      } catch (err) {
        Sentry.logger.error(JSON.stringify(err));
        setError('No pudimos iniciar sesión. Inténtalo de nuevo.');
        setSubmitting(false);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Agora | Login</title>
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
                Bienvenido de vuelta
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                {isEmailValidated ? (
                  <>
                    Hola <strong>{email}</strong>, ingresa tu contraseña para continuar.
                  </>
                ) : (
                  'Inicia sesión para continuar a Agora.'
                )}
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

                  {!isEmailValidated && (
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
                        endAdornment: isEmailValidated && (
                          <MLink
                            underline="none"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              setIsEmailValidated(false);
                              setPassword('');
                            }}
                          >
                            editar
                          </MLink>
                        ),
                      }}
                    />
                  )}

                  {isEmailValidated && (
                    <>
                      <TextField
                        type={showPw ? 'text' : 'password'}
                        label="Contraseña"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        autoComplete="current-password"
                        InputProps={{
                          autoFocus: isEmailValidated,
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockRounded />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="mostrar contraseña"
                                onClick={() => setShowPw((s) => !s)}
                                edge="end"
                              >
                                {showPw ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="flex-end"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                      >
                        {/* <FormControlLabel
                          control={
                            <Checkbox
                              checked={remember}
                              onChange={(e) => setRemember(e.target.checked)}
                            />
                          }
                          label="Recordarme"
                        /> */}
                        <MLink href="/recovery" underline="hover" component={Link}>
                          ¿Olvidaste tu contraseña?
                        </MLink>
                      </Stack>
                    </>
                  )}

                  <Button type="submit" size="large" variant="contained" disabled={submitting}>
                    {isEmailValidated ? (
                      submitting ? (
                        <CircularProgress size={24} />
                      ) : (
                        'Ingresar'
                      )
                    ) : submitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Continuar'
                    )}
                  </Button>

                  {isEmailValidated && (
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={() => {
                        setIsEmailValidated(false);
                        setPassword('');
                      }}
                    >
                      Regresar
                    </Button>
                  )}

                  {!isEmailValidated && (
                    <>
                      <Divider flexItem>
                        <Typography variant="caption" color="text.secondary">
                          o continúa con
                        </Typography>
                      </Divider>

                      <Stack spacing={2} direction={'row'} justifyContent="center">
                        <Button
                          variant="outlined"
                          startIcon={<GoogleIcon />}
                          fullWidth
                          onClick={() => {
                            // TODO: start your OAuth flow
                            Sentry.logger.info('Google OAuth');
                          }}
                        >
                          Google
                        </Button>

                        <Button
                          variant="outlined"
                          fullWidth
                          startIcon={<AppleIcon />}
                          onClick={() => {
                            // TODO: start your OAuth flow
                            Sentry.logger.info('Apple OAuth');
                          }}
                        >
                          Apple
                        </Button>
                      </Stack>

                      <Typography variant="body2" color="text.secondary" textAlign="center">
                        ¿Aún no tienes cuenta?{' '}
                        <MLink href="/sign-up" underline="hover" component={Link}>
                          Crear cuenta
                        </MLink>
                      </Typography>
                    </>
                  )}
                  {/* Security hint (roles/MFA) */}
                  {/*<Alert severity="info" variant="outlined" sx={{ mt: 1 }}>*/}
                  {/*  Para eventos con reglas avanzadas, los inversionistas podrían requerir{' '}*/}
                  {/*  <strong>MFA</strong>.*/}
                  {/*</Alert>*/}
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

export const getServerSideProps = (ctx) => {
  const authHeader = createAuthHeader(ctx.req);
  if (authHeader) return {
    redirect: {
      destination: '/events',
      permanent: false,
    }
  };

  return { props: {} };
};

export default LoginPage;