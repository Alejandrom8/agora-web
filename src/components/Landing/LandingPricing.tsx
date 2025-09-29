import LandingSection from './LandingSection';
import {
  Button,
  Card,
  Container,
  Stack,
  Typography,
  alpha,
  Grid,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Divider,
  ListItemText,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function LandingPricing() {
  return (
    <LandingSection id="precios" sx={{ backgroundColor: alpha('#FFFFFF', 0.02) }}>
      <Container>
        <Typography variant="overline" color="text.secondary">
          Precios
        </Typography>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Planes simples para empezar
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              name: 'Starter',
              price: 'Gratis',
              perks: ['1 evento', '100 asistentes', 'Perfil público'],
            },
            {
              name: 'Pro',
              price: '$49/mes',
              perks: ['Eventos ilimitados', 'Reglas avanzadas', 'Invitaciones por lote'],
            },
            {
              name: 'Enterprise',
              price: 'A medida',
              perks: ['Soporte dedicado', 'SSO/MFA corporativo', 'SLA'],
            },
          ].map((p) => (
            <Grid size={{ xs: 12, md: 4 }} key={p.name}>
              <Card>
                <CardContent>
                  <Typography variant="h5" fontWeight={900}>
                    {p.name}
                  </Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ my: 1 }}>
                    {p.price}
                  </Typography>
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
    </LandingSection>
  );
}
