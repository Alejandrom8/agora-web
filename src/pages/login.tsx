// Agora Login Page — Material UI 5 + TypeScript (Next.js friendly)
// Drop-in page component. If you're using Next.js App Router, you can save it as app/login/page.tsx
// It assumes you already wrapped your app with ThemeProvider using the Agora theme.

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
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import LoginRounded from "@mui/icons-material/LoginRounded";
import GoogleIcon from "@mui/icons-material/Google";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import {useRouter} from "next/navigation";

// Optional: small helper to fetch brand colors from theme
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

// Simple email/password validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage(): React.JSX.Element {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPw, setShowPw] = React.useState(false);
    const [remember, setRemember] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push('/manage');
        return;
        setError(null);

        if (!isValidEmail(email)) {
            setError("Por favor ingresa un correo válido.");
            return;
        }
        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        try {
            setSubmitting(true);
            // TODO: Replace with your auth call
            // Example: await signIn({ email, password, remember })
            await new Promise((res) => setTimeout(res, 900));
            // Redirect to events or admin dashboard based on role
            // router.push("/events");
            console.log({ email, passwordMasked: "••••••••", remember });
        } catch (err) {
            setError("No pudimos iniciar sesión. Inténtalo de nuevo.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Ingresar a Agora</title>
                <meta name="description" content="Inicia sesión en Agora para crear y descubrir eventos tecnológicos." />
            </Head>

            <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
                <Box sx={{ width: "100%", py: { xs: 8, md: 10 }, ...subtleBg }}>
                    <Container maxWidth="sm">
                        <Stack spacing={3} alignItems="center" sx={{ mb: 2 }}>
                            <Logo />
                            <Typography variant="h3" fontWeight={900} textAlign="center">
                                Bienvenido de vuelta
                            </Typography>
                            <Typography color="text.secondary" textAlign="center">
                                Conecta founders e inversionistas por medio de eventos de tecnología.
                            </Typography>
                        </Stack>

                        <Card sx={panelSx}>
                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                <Stack component="form" spacing={2.5} onSubmit={onSubmit} noValidate>
                                    {error && <Alert severity="error" variant="outlined">{error}</Alert>}

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
                                        type={showPw ? "text" : "password"}
                                        label="Contraseña"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        required
                                        autoComplete="current-password"
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

                                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                                            label="Recordarme"
                                        />
                                        <MLink href="#/forgot" underline="hover">
                                            ¿Olvidaste tu contraseña?
                                        </MLink>
                                    </Stack>

                                    <Button
                                        type="submit"
                                        size="large"
                                        variant="contained"
                                        startIcon={<LoginRounded />}
                                        disabled={submitting}
                                    >
                                        {submitting ? "Iniciando…" : "Ingresar"}
                                    </Button>

                                    <Divider flexItem>
                                        <Typography variant="caption" color="text.secondary">
                                            o continúa con
                                        </Typography>
                                    </Divider>

                                    <Button
                                        variant="outlined"
                                        startIcon={<GoogleIcon />}
                                        onClick={() => {
                                            // TODO: start your OAuth flow
                                            console.log("Google OAuth");
                                        }}
                                    >
                                        Google
                                    </Button>

                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        ¿Aún no tienes cuenta? {" "}
                                        <MLink href="/sign-up" underline="hover">
                                            Crear cuenta
                                        </MLink>
                                    </Typography>

                                    {/* Security hint (roles/MFA) */}
                                    <Alert severity="info" variant="outlined" sx={{ mt: 1 }}>
                                        Para eventos con reglas avanzadas, los inversionistas podrían requerir <strong>MFA</strong>.
                                    </Alert>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Stack spacing={1} alignItems="center" sx={{ mt: 3 }}>
                            <Typography variant="caption" color="text.secondary">
                                Al continuar aceptas nuestros <MLink href="#/terms">Términos</MLink> y <MLink href="#/privacy">Política de privacidad</MLink>.
                            </Typography>
                        </Stack>
                    </Container>
                </Box>
            </Box>
        </>
    );
}