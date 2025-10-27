import * as React from 'react';
import Head from 'next/head';
import {
  Button,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Toolbar,
} from '@mui/material';
import LandingLayout from '@/components/Landing/LandingLayout';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { useRouter } from 'next/router';

export default function OrganizationsPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Organizaciones en Agora</title>
        <meta
          name="description"
          content="Crea y gestiona tu organización en Agora. Descubre los beneficios de digitalizar tus eventos y conectar con el ecosistema tech."
        />
      </Head>
      <LandingLayout>
        <Toolbar />
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={4} alignItems="center">
            <Typography variant="h2" fontWeight={900} textAlign="center" gutterBottom>
              Lleva tus eventos al siguiente nivel con Agora
            </Typography>
            <Typography variant="h5" color="text.secondary" textAlign="center" maxWidth={700}>
              Digitaliza tus eventos, conecta con founders, inversionistas y asistentes, y gestiona
              tu comunidad desde una sola plataforma.
            </Typography>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={() => router.push('/org/onboard')}
              sx={{ px: 5, py: 1.5, fontWeight: 700, fontSize: 18 }}
            >
              Crea tu organización
            </Button>
          </Stack>

          <Grid container spacing={4} sx={{ mt: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Chip
                      icon={<BusinessCenterRoundedIcon />}
                      label="Gestión integral de eventos"
                      color="primary"
                    />
                    <Typography variant="h6" fontWeight={700}>
                      Administra todos tus eventos
                    </Typography>
                    <Typography color="text.secondary">
                      Crea, edita y publica eventos fácilmente. Define agendas, roles, categorías y
                      asistentes desde un solo lugar.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Chip
                      icon={<GroupsRoundedIcon />}
                      label="Comunidad y networking"
                      color="info"
                    />
                    <Typography variant="h6" fontWeight={700}>
                      Conecta con el ecosistema
                    </Typography>
                    <Typography color="text.secondary">
                      Invita a founders, inversionistas y expertos. Fomenta el networking y el
                      crecimiento de tu comunidad.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Chip
                      icon={<EventAvailableRoundedIcon />}
                      label="Automatización y control"
                      color="secondary"
                    />
                    <Typography variant="h6" fontWeight={700}>
                      Automatiza y mide tus eventos
                    </Typography>
                    <Typography color="text.secondary">
                      Controla accesos, roles y asistencia. Obtén analíticas en tiempo real y
                      reportes de impacto.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={2} alignItems="flex-start">
                    <Chip
                      icon={<VerifiedUserRoundedIcon />}
                      label="Seguridad y confianza"
                      color="secondary"
                    />
                    <Typography variant="h6" fontWeight={700}>
                      Privacidad y control de datos
                    </Typography>
                    <Typography color="text.secondary">
                      Protege la información de tu organización y asistentes. Cumple con las mejores
                      prácticas de privacidad y seguridad.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </LandingLayout>
    </>
  );
}
