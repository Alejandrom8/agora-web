import LandingSection from './LandingSection';
import { Card, CardContent, Container, Grid, Typography } from '@mui/material';

export default function LandingHowItWorks() {
  return (
    <LandingSection id="como-funciona">
      <Container>
        <Typography variant="overline" color="text.secondary">
          Cómo funciona
        </Typography>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Del registro al match en 3 pasos
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              title: '1) Publica tu evento',
              desc: 'Configura datos, agenda, categorías y reglas. Invita a tu audiencia por correo o archivo de asistentes.',
            },
            {
              title: '2) Activa perfiles y accesos',
              desc: 'Founders e inversionistas completan perfiles. Controla accesos a sub-eventos según reglas por rol.',
            },
            {
              title: '3) Conecta y da seguimiento',
              desc: 'Los asistentes descubren proyectos, agendan sesiones y continúan la conversación después del evento.',
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
    </LandingSection>
  );
}
