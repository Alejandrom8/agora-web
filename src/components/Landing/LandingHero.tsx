import {
  Box,
  Container,
  Grid,
  Stack,
  Chip,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  useTheme,
} from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import HubIcon from '@mui/icons-material/Hub';


// Los colores principales y acentos ahora dependen del theme
export default function LandingHero() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const primary = theme.palette.primary.main;
  const accent = isLight ? theme.palette.primary.light : theme.palette.primary.dark;
  const accent2 = isLight ? theme.palette.info.light : theme.palette.info.dark;
  const heroBg = isLight
    ? 'rgba(255,255,255,0.7)'
    : 'rgba(0,0,0,0.7)';

  return (
    <Box
      sx={{
        backgroundImage: 'url("/splash_desk.svg")',
        backgroundSize: '112vw 170%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      <Box
        component="header"
        sx={{
          pt: { xs: 15, md: 22 },
          pb: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          minHeight: { xs: '100vh', md: '100vh', xl: 'auto' },
          backgroundColor: heroBg,
          backdropFilter: 'blur(12px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                <Chip
                  label="Eventos Tech • Perfiles en vivo"
                  color="primary"
                  variant="outlined"
                  sx={{ width: 'fit-content' }}
                />
                <Typography variant="h1" sx={{ fontSize: '4rem' }}>
                  Conecta{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(90deg, ${primary}, ${accent}, ${accent2})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    founders
                  </Box>{' '}
                  e{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(90deg, ${accent2}, ${accent}, ${primary})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    inversionistas
                  </Box>{' '}
                  con propósito.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720 }}>
                  Agora es la plataforma para descubrir proyectos, conocer perfiles y dar
                  seguimiento durante y después de cada evento tecnológico.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button size="large" variant="contained" color="primary" href="#ver-eventos">
                    Ingresa a la beta
                  </Button>
                  <Button size="large" variant="outlined" color="inherit" href="#como-funciona">
                    Cómo funciona
                  </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Chip
                    icon={<HubIcon fontSize={'small'} />}
                    label="Match con IA"
                    color="info"
                    variant="filled"
                  />
                  <Chip
                    icon={<PeopleAltRoundedIcon />}
                    label="Analíticas de tus eventos"
                    variant="outlined"
                  />
                  <Chip
                    icon={<ShieldRoundedIcon />}
                    label="Un perfíl por evento"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  alt="Preview del evento"
                  height="260"
                  src={'/school.jpg'}
                />
                <CardContent>
                  {/*<Typography variant="subtitle2" color="text.secondary">*/}
                  {/*  Preview del evento (vista pública)*/}
                  {/*</Typography>*/}
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
  );
}
