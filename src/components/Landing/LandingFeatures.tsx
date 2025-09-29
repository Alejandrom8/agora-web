import LandingSection from './LandingSection';
import {
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';

export default function LandingFeatures() {
  return (
    <LandingSection id="funcionalidades">
      <Container>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Typography variant="overline" color="text.secondary">
            Funcionalidades
          </Typography>
          <Typography variant="h2">Todo lo que necesitas para activar tu ecosistema</Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={900}>
            Desde autenticación y descubrimiento de eventos hasta una consola de administración
            completa para configurar agendas, roles, categorías y asistentes.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <PeopleAltRoundedIcon />
                  <Typography variant="h6" fontWeight={800}>
                    Usuarios asistentes
                  </Typography>
                </Stack>
                <List dense>
                  {['Login', 'Signup', 'Ver eventos'].map((t) => (
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
                  <Typography variant="h6" fontWeight={800}>
                    Administradores
                  </Typography>
                </Stack>
                <List dense>
                  {[
                    'Crear eventos: datos, portada, fecha',
                    'Definir agenda: sub-eventos con registro',
                    'Reglas por rol (founder, inversionista, asistente)',
                    'Definir categorías (speaker, staff, tecnólogo…)',
                    'Cargar asistentes (Excel) o crear manualmente',
                    'Listar/filtrar/buscar/ordenar asistentes',
                    'Edición masiva de rol/categoría',
                    'Enviar invitaciones (individual/lote)',
                    'Preview público del evento',
                    'Administración de sub-eventos',
                    'Dashboard analítico (asistentes por evento/rol)',
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
    </LandingSection>
  );
}
