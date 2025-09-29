import { alpha, Box, Container, Link as MLink, Stack, Typography } from '@mui/material';
import * as React from 'react';
import TypoLogo from '@/components/App/TypoLogo';

// --- Compact brand theme (matches your palette) ---
const primary = '#0057C9' as const;
const accent = '#0370FF' as const;

export default function LandingFooter() {
  return (
    <Box component="footer" sx={{ py: 6, borderTop: `1px solid ${alpha('#FFFFFF', 0.06)}` }}>
      <Container>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <TypoLogo />
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Agora. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={2}>
            <MLink href="#privacidad" underline="hover">
              Privacidad
            </MLink>
            <MLink href="#terminos" underline="hover">
              Términos
            </MLink>
            <MLink href="#contacto" underline="hover">
              Contacto
            </MLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
