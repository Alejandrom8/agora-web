// Agora Signup Page — Material UI 5 + TypeScript (Next.js friendly)
// Save as: app/signup/page.tsx (App Router) or pages/signup.tsx (Pages Router)
// Assumes your app is wrapped with ThemeProvider using the Agora theme.

import * as React from "react";
import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Link as MLink,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  MenuItem,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import PersonOutlineRounded from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import HowToRegRounded from "@mui/icons-material/HowToRegRounded";

// Roles & Categories aligned with Agora context
const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "investor", label: "Inversionista" },
  { value: "attendee", label: "Asistente" },
] as const;

const CATEGORIES = [
  "Speaker",
  "Staff",
  "Tecnólogo",
  "Mentor",
  "Jurado",
  "Prensa",
];

const Logo: React.FC = () => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Box sx={{ width: 28, height: 28, borderRadius: 2, background: (t) => `linear-gradient(135deg, ${t.palette.primary.main}, ${t.palette.info.main})` }} />
    <Typography variant="h6" fontWeight={900}>Agora</Typography>
  </Stack>
);

const panelSx: SxProps<Theme> = (t) => ({
  borderRadius: 2,
  backgroundImage: "none",
  border: `1px solid ${alpha("#FFFFFF", 0.08)}`,
  boxShadow: `0 10px 30px ${alpha("#000", 0.35)}`,
  backdropFilter: "blur(8px)",
});

const subtleBg: SxProps<Theme> = (t) => ({
  backgroundImage: `radial-gradient(1200px 800px at 80% -10%, ${alpha(t.palette.info.main, 0.06)} 0%, transparent 60%),
                     radial-gradient(1000px 600px at -10% 120%, ${alpha(t.palette.primary.main, 0.05)} 0%, transparent 60%)`,
});

// Simple validators
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const pwScore = (pw: string) => {
  // 0..4 strength (very simple heuristic)
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^\w\s]/.test(pw)) score++;
  return Math.min(score, 4);
};
const pwLabel = (s: number) => ["Muy débil", "Débil", "Aceptable", "Fuerte", "Muy fuerte"][s] ?? "";

export default function SignupPage(): React.JSX.Element {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<typeof ROLES[number]["value"]>("founder");
  const [category, setCategory] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [tos, setTos] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);

  const score = pwScore(password);
  const progress = (score / 4) * 100;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Por favor ingresa tu nombre.");
    if (!isValidEmail(email)) return setError("Ingresa un correo válido.");
    if (!tos) return setError("Debes aceptar los Términos y la Privacidad.");
    if (password.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (password !== confirm) return setError("Las contraseñas no coinciden.");

    try {
      setSubmitting(true);
      // TODO: Replace with your signup API
      await new Promise((res) => setTimeout(res, 900));
      // Example: await signUp({ name, email, role, category, password })
      setOk(true);
      // router.push("/events")
      console.log({ name, email, role, category, passwordMasked: "••••••••" });
    } catch (err) {
      setError("No pudimos crear tu cuenta. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Crear cuenta — Agora</title>
        <meta name="description" content="Crea tu cuenta en Agora para participar en eventos tecnológicos y conectar con el ecosistema." />
      </Head>

      <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
        <Box sx={{ width: "100%", py: { xs: 8, md: 10 }, ...subtleBg }}>
          <Container maxWidth="sm">
            <Stack spacing={3} alignItems="center" sx={{ mb: 2 }}>
              <Logo />
              <Typography variant="h3" fontWeight={900} textAlign="center">
                Crea tu cuenta
              </Typography>
              <Typography color="text.secondary" textAlign="center">
                Únete a eventos de tecnología: descubre proyectos, conecta y da seguimiento.
              </Typography>
            </Stack>

            <Card sx={panelSx}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
                  {error && <Alert severity="error" variant="outlined">{error}</Alert>}

                  <TextField
                    label="Nombre completo"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineRounded />
                        </InputAdornment>
                      ),
                    }}
                  />

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

                  <TextField
                    select
                    label="Rol principal"
                    value={role}
                    onChange={(e) => setRole(e.target.value as typeof ROLES[number]["value"])}
                    helperText="Podrás actualizarlo por evento."
                    fullWidth
                  >
                    {ROLES.map((r) => (
                      <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    label="Categoría (opcional)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Sin categoría</MenuItem>
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </TextField>

                  <Stack spacing={1.5}>
                    <TextField
                      type={showPw ? "text" : "password"}
                      label="Contraseña"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                      required
                      autoComplete="new-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockRounded />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label="mostrar contraseña" onClick={() => setShowPw((s) => !s)} edge="end">
                              {showPw ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
                    <Typography variant="caption" color={progress < 50 ? "error" : progress < 75 ? "warning.main" : "success.main"}>
                      Fortaleza: {pwLabel(score)}
                    </Typography>
                  </Stack>

                  <TextField
                    type={showConfirm ? "text" : "password"}
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    fullWidth
                    required
                    autoComplete="new-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRounded />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="mostrar contraseña" onClick={() => setShowConfirm((s) => !s)} edge="end">
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControlLabel
                    control={<Checkbox checked={tos} onChange={(e) => setTos(e.target.checked)} />}
                    label={<Typography variant="body2">Acepto los <MLink href="#/terms">Términos</MLink> y la <MLink href="#/privacy">Política de privacidad</MLink>.</Typography>}
                  />

                  <Button type="submit" size="large" variant="contained" startIcon={<HowToRegRounded />} disabled={submitting}>
                    {submitting ? "Creando cuenta…" : "Crear cuenta"}
                  </Button>

                  <Divider flexItem>
                    <Typography variant="caption" color="text.secondary">¿Ya tienes cuenta?</Typography>
                  </Divider>

                  <Button variant="outlined" onClick={() => (window.location.href = "/login")}>Ir a Ingresar</Button>

                  <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
                    Nota: Algunos eventos podrían requerir <strong>MFA</strong> para perfiles de inversionista.
                  </Alert>
                </Stack>
              </CardContent>
            </Card>

            <Stack spacing={1} alignItems="center" sx={{ mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Protegemos tus datos. Puedes actualizar tu rol o categoría por evento.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Snackbar
        open={ok}
        autoHideDuration={2500}
        onClose={() => setOk(false)}
        message="Cuenta creada. Redirigiendo…"
      />
    </>
  );
}