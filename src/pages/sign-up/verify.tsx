// pages/verification.tsx
import * as React from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, TextField, Button, Snackbar } from '@mui/material';
import { verifyEmail } from '@/hooks/useSession';
import TypoLogo from '@/components/App/TypoLogo';
import { useRouter } from 'next/router';

function VerificationPage({ email }: { email: string }): React.JSX.Element {
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [ok, setOk] = React.useState(false);
  const router = useRouter();

  const CELLS = 6;
  const [values, setValues] = React.useState<string[]>(Array.from({ length: CELLS }, () => ''));
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  const focusAt = (idx: number) => {
    const el = inputsRef.current[idx];
    if (el) el.focus();
  };

  const setCell = (idx: number, val: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digit = raw.replace(/\D/g, '').slice(0, 1); // solo 1 dígito
    setCell(idx, digit);
    if (digit && idx < CELLS - 1) focusAt(idx + 1);
  };

  const handleKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    // Retroceder con Backspace si la celda está vacía
    if (key === 'Backspace' && !values[idx] && idx > 0) {
      e.preventDefault();
      setCell(idx - 1, '');
      focusAt(idx - 1);
      return;
    }

    // Flechas para navegar
    if (key === 'ArrowLeft' && idx > 0) focusAt(idx - 1);
    if (key === 'ArrowRight' && idx < CELLS - 1) focusAt(idx + 1);
  };

  // Permite pegar un código completo (p. ej., “123456”)
  const handlePaste = (idx: number) => (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CELLS);
    if (!text) return;

    e.preventDefault();
    const next = [...values];
    for (let i = 0; i < text.length && idx + i < CELLS; i++) {
      next[idx + i] = text[i];
    }
    setValues(next);

    const focusTo = Math.min(idx + text.length, CELLS - 1);
    focusAt(focusTo);
  };

  const code = values.join('');
  const isComplete = code.length === CELLS && values.every((v) => v !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    try {
      setSubmitting(true);
      await verifyEmail(email, code);
      setOk(true);
      const nextUrl = String(router.query?.next || '');
      router.push(nextUrl && nextUrl !== '' ? nextUrl : '/events');
    } catch {
      setError('Código inválido. Intenta nuevamente.');
      setValues(Array.from({ length: CELLS }, () => ''));
      focusAt(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verificación | Agora</title>
      </Head>

      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%' }}
          aria-label="Formulario de verificación de 6 dígitos"
        >
          <Stack spacing={3} alignItems="center">
            <TypoLogo />
            <Stack spacing={1} alignItems="center">
              <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center' }}>
                Verifica tu código
              </Typography>
              <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Ingresa el código de 6 dígitos que enviamos a tu correo.
              </Typography>
            </Stack>

            <Box>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1.5} justifyContent="center">
              {values.map((val, i) => (
                <TextField
                  key={i}
                  value={val}
                  onChange={handleChange(i)}
                  onKeyDown={handleKeyDown(i)}
                  onPaste={handlePaste(i)}
                  inputRef={(el) => (inputsRef.current[i] = el)}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: 24,
                      fontWeight: 700,
                      width: 48,
                      height: 56,
                    },
                    'aria-label': `Dígito ${i + 1} del código`,
                  }}
                />
              ))}
            </Stack>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isComplete || submitting}
              sx={{ px: 4, fontWeight: 700 }}
            >
              {submitting ? 'Verificando...' : 'Verificar'}
            </Button>

            {/* Ayuda opcional */}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ¿No recibiste el código?{' '}
              <Button variant="text" size="small">
                Reenviar
              </Button>
            </Typography>
          </Stack>
        </Box>
      </Container>
      <Snackbar
        open={ok}
        autoHideDuration={2500}
        onClose={() => setOk(false)}
        message="Código verificado. Redirigiendo…"
      />
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const email = ctx.query.email || '';
  return { props: { email } };
};

export default VerificationPage;
