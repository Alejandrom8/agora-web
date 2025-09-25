import * as React from "react";
import Head from "next/head";
import {
  alpha,
  Box,
  Container,
  Stack,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Link as MLink,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import HorizontalNavbar from "@/components/App/HorizontalNavbar";

// --- Compact brand theme (matches your palette) ---
const bgBase = "#181A20" as const;
const surface = "#1E222A" as const;
const primary = "#0057C9" as const;
const secondary = "#343539" as const;
const accent = "#0370FF" as const;

// Reusable Section wrapper with TS props
type SectionProps = {
  id?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};
const Section: React.FC<SectionProps> = ({ id, children, sx }) => (
    <Box id={id} component="section" sx={{ py: { xs: 8, md: 12 }, ...sx }}>
      {children}
    </Box>
);

// Feature item
type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
    <Stack direction="row" spacing={2} alignItems="flex-start">
      <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha("#FFFFFF", 0.06) }}>{icon}</Box>
      <Box>
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Stack>
);

const AgoraLanding: React.FC = () => {
  return <>
    <Head>
      <title>Agora — Conecta Founders e Inversionistas</title>
      <meta
          name="description"
          content="Agora conecta founders e inversionistas por medio de eventos tecnológicos: crea eventos, define agendas y roles, gestiona asistentes e invita a participar."
      />
      <link rel="canonical" href="https://agora-web-three.vercel.app/" />
    </Head>

    {/* NAVBAR */}
    <HorizontalNavbar />

    {/* HERO */}
    <Box
      sx={{
        backgroundImage: 'url("/splash_desk.svg")',
        backgroundSize: "112vw 170%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      }}
    >
      <Box
        component="header"
        sx={{
          pt: { xs: 8, md: 18 },
          pb: { xs: 8, md: 14 },
          position: "relative",
          overflow: "hidden",
          width: '100%',
          height: '90vh',
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                <Chip label="Eventos Tech • Perfiles en vivo" color="primary" variant="outlined" sx={{ width: "fit-content" }} />
                <Typography variant="h1">
                  Conecta <Box component="span" sx={{ background: `linear-gradient(90deg, ${primary}, ${accent})`, backgroundClip: "text", color: "transparent", display: "inline-block" }}>founders</Box> e <Box component="span" sx={{ background: `linear-gradient(90deg, ${accent}, ${primary})`, backgroundClip: "text", color: "transparent", display: "inline-block" }}>inversionistas</Box> con propósito.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720 }}>
                  Agora es la plataforma para descubrir proyectos, conocer perfiles y dar seguimiento durante y después de cada evento tecnológico.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button size="large" variant="contained" color="primary" href="#ver-eventos">
                    Ver eventos
                  </Button>
                  <Button size="large" variant="outlined" color="inherit" href="#como-funciona">
                    Cómo funciona
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Chip icon={<RocketLaunchRoundedIcon />} label="Signup" color="info" variant="filled" />
                  <Chip icon={<PeopleAltRoundedIcon />} label="Perfiles por rol" variant="outlined" />
                  <Chip icon={<ShieldRoundedIcon />} label="Reglas y MFA" variant="outlined" />
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ overflow: "hidden" }}>
                <CardMedia
                    component="img"
                    alt="Preview del evento"
                    height="260"
                    image={`data:image/svg+xml;utf8,${encodeURIComponent(`
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 420'>
                    <defs>
                      <linearGradient id='g' x1='0' x2='1'>
                        <stop offset='0%' stop-color='${primary}'/>
                        <stop offset='100%' stop-color='${accent}'/>
                      </linearGradient>
                    </defs>
                    <rect width='100%' height='100%' fill='${surface}'/>
                    <rect x='40' y='40' width='720' height='140' rx='16' fill='url(#g)' opacity='0.3'/>
                    <rect x='40' y='220' width='320' height='24' rx='6' fill='white' opacity='0.7'/>
                    <rect x='40' y='260' width='480' height='14' rx='6' fill='white' opacity='0.35'/>
                    <rect x='40' y='290' width='420' height='14' rx='6' fill='white' opacity='0.2'/>
                  </svg>
                `)}`}
                />
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Preview del evento (vista pública)
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip size="small" label="Pitch Day" color="primary" />
                    <Chip size="small" label="AI • Fintech • Climate" variant="outlined" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>

    {/* FUNCIONALIDADES (Usuarios + Admins) */}
    <Section id="funcionalidades">
      <Container>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="overline" color="text.secondary">Funcionalidades</Typography>
          <Typography variant="h2">Todo lo que necesitas para activar tu ecosistema</Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={900}>
            Desde autenticación y descubrimiento de eventos hasta una consola de administración completa para configurar agendas, roles, categorías y asistentes.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <PeopleAltRoundedIcon />
                  <Typography variant="h6" fontWeight={800}>Usuarios asistentes</Typography>
                </Stack>
                <List dense>
                  {["Login", "Signup", "Ver eventos"].map((t) => (
                      <ListItem key={t} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleRoundedIcon color="info" />
                        </ListItemIcon>
                        <ListItemText primary={t} />
                      </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <ShieldRoundedIcon />
                  <Typography variant="h6" fontWeight={800}>Administradores</Typography>
                </Stack>
                <List dense>
                  {[
                    "Crear eventos: datos, portada, fecha",
                    "Definir agenda: sub-eventos con registro",
                    "Reglas por rol (founder, inversionista, asistente)",
                    "Definir categorías (speaker, staff, tecnólogo…)",
                    "Cargar asistentes (Excel) o crear manualmente",
                    "Listar/filtrar/buscar/ordenar asistentes",
                    "Edición masiva de rol/categoría",
                    "Enviar invitaciones (individual/lote)",
                    "Preview público del evento",
                    "Administración de sub-eventos",
                    "Dashboard analítico (asistentes por evento/rol)",
                  ].map((t) => (
                      <ListItem key={t} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleRoundedIcon color="info" />
                        </ListItemIcon>
                        <ListItemText primary={t} />
                      </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Section>

    {/* PARA ADMINS (Highlights) */}
    <Section id="para-admins" sx={{ backgroundColor: alpha("#FFFFFF", 0.02) }}>
      <Container>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Feature icon={<EventAvailableRoundedIcon color="info" />} title="Crea eventos en minutos" description="Define datos generales, agenda y sub-eventos con registro. Usa categorías y roles para segmentar a tu audiencia." />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Feature icon={<ShieldRoundedIcon color="info" />} title="Control de acceso granular" description="Establece reglas por rol: MFA para inversionistas, requisitos para founders y permisos por categoría." />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Feature icon={<InsightsRoundedIcon color="info" />} title="Métricas accionables" description="Panel analítico: asistentes totales por evento/sub-evento y desglose por rol para medir impacto." />
          </Grid>
        </Grid>
      </Container>
    </Section>

    {/* CÓMO FUNCIONA */}
    <Section id="como-funciona">
      <Container>
        <Typography variant="overline" color="text.secondary">Cómo funciona</Typography>
        <Typography variant="h2" sx={{ mb: 3 }}>Del registro al match en 3 pasos</Typography>
        <Grid container spacing={3}>
          {[
            {
              title: "1) Publica tu evento",
              desc: "Configura datos, agenda, categorías y reglas. Invita a tu audiencia por correo o archivo de asistentes.",
            },
            {
              title: "2) Activa perfiles y accesos",
              desc: "Founders e inversionistas completan perfiles. Controla accesos a sub-eventos según reglas por rol.",
            },
            {
              title: "3) Conecta y da seguimiento",
              desc: "Los asistentes descubren proyectos, agendan sesiones y continúan la conversación después del evento.",
            },
          ].map((s, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" fontWeight={800} gutterBottom>
                      {s.title}
                    </Typography>
                    <Typography color="text.secondary">{s.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Container>
    </Section>

    {/* CTA: Ver eventos */}
    <Section id="ver-eventos" sx={{ py: { xs: 8, md: 10 } }}>
      <Container>
        <Card sx={{ textAlign: "center", p: { xs: 4, md: 6 } }}>
          <Typography variant="h3" fontWeight={900} gutterBottom>
            Explora los próximos eventos
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Agenda, speakers y reglas de acceso. Únete y descubre a tu próximo socio.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="center" spacing={2}>
            <Button size="large" variant="contained" color="primary">
              Ver eventos
            </Button>
            <Button size="large" variant="outlined" color="inherit">
              Soy founder
            </Button>
            <Button size="large" variant="outlined" color="inherit">
              Soy inversionista
            </Button>
          </Stack>
        </Card>
      </Container>
    </Section>

    {/* PRECIOS (placeholder simple) */}
    <Section id="precios" sx={{ backgroundColor: alpha("#FFFFFF", 0.02) }}>
      <Container>
        <Typography variant="overline" color="text.secondary">Precios</Typography>
        <Typography variant="h2" sx={{ mb: 3 }}>Planes simples para empezar</Typography>
        <Grid container spacing={3}>
          {[
            { name: "Starter", price: "Gratis", perks: ["1 evento", "100 asistentes", "Perfil público"] },
            { name: "Pro", price: "$49/mes", perks: ["Eventos ilimitados", "Reglas avanzadas", "Invitaciones por lote"] },
            { name: "Enterprise", price: "A medida", perks: ["Soporte dedicado", "SSO/MFA corporativo", "SLA"] },
          ].map((p) => (
              <Grid size={{ xs: 12, md: 4}} key={p.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" fontWeight={900}>{p.name}</Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ my: 1 }}>{p.price}</Typography>
                    <Divider sx={{ mb: 1, opacity: 0.2 }} />
                    <List dense>
                      {p.perks.map((k) => (
                          <ListItem key={k} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircleRoundedIcon color="info" />
                            </ListItemIcon>
                            <ListItemText primary={k} />
                          </ListItem>
                      ))}
                    </List>
                    <Button fullWidth variant="contained" color="primary" sx={{ mt: 1 }}>
                      Elegir {p.name}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
          ))}
        </Grid>
      </Container>
    </Section>

    {/* FOOTER */}
    <Box component="footer" sx={{ py: 6, borderTop: `1px solid ${alpha("#FFFFFF", 0.06)}` }}>
      <Container>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 24, height: 24, borderRadius: 2, background: `linear-gradient(135deg, ${primary}, ${accent})` }} />
            <Typography fontWeight={800}>Agora</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Agora. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={2}>
            <MLink href="#privacidad" underline="hover">Privacidad</MLink>
            <MLink href="#terminos" underline="hover">Términos</MLink>
            <MLink href="#contacto" underline="hover">Contacto</MLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  </>;
};

export default AgoraLanding;