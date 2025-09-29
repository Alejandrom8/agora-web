import LandingSection from '@/components/Landing/LandingSection';
import { Container, Grid, alpha } from '@mui/material';
import LandingFeature from '@/components/Landing/LandingFeature';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';

export default function LandingForAdminsSection() {
  return (
    <LandingSection id="para-admins" sx={{ backgroundColor: alpha('#FFFFFF', 0.02) }}>
      <Container>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <LandingFeature
              icon={<EventAvailableRoundedIcon color="info" />}
              title="Crea eventos en minutos"
              description="Define datos generales, agenda y sub-eventos con registro. Usa categorías y roles para segmentar a tu audiencia."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <LandingFeature
              icon={<ShieldRoundedIcon color="info" />}
              title="Control de acceso granular"
              description="Establece reglas por rol: MFA para inversionistas, requisitos para founders y permisos por categoría."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <LandingFeature
              icon={<InsightsRoundedIcon color="info" />}
              title="Métricas accionables"
              description="Panel analítico: asistentes totales por evento/sub-evento y desglose por rol para medir impacto."
            />
          </Grid>
        </Grid>
      </Container>
    </LandingSection>
  );
}
