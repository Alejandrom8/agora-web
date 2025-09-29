import LandingSection from '@/components/Landing/LandingSection';
import { Button, Card, Container, Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function LandingEvents() {
  return (
    <LandingSection id="ver-eventos" sx={{ py: { xs: 8, md: 10 } }}>
      <Container>
        <Card sx={{ textAlign: 'center', p: { xs: 4, md: 6 } }}>
          <Typography variant="h3" fontWeight={900} gutterBottom>
            Explora los próximos eventos
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Agenda, speakers y reglas de acceso. Únete y descubre a tu próximo socio.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" spacing={2}>
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
    </LandingSection>
  );
}
