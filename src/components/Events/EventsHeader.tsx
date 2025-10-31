import * as React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export function EventsHeader() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: { xs: 6, md: 8 },
        pb: { xs: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '100%',
          background: `radial-gradient(ellipse at top, ${alpha(
            theme.palette.primary.main,
            0.15
          )} 0%, transparent 60%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Título principal */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(
                theme.palette.text.primary,
                0.7
              )})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Descubre eventos tech increíbles
          </Typography>

          {/* Descripción */}
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              fontWeight: 400,
              lineHeight: 1.6,
              color: theme.palette.text.secondary,
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, sm: 0 },
            }}
          >
            Conecta con la comunidad tecnológica más vibrante. Encuentra meetups,
            workshops, charlas de IA y sesiones de UX que impulsen tu carrera.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

