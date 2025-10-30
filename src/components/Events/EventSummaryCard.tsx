import * as React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

interface EventSummaryCardProps {
  organizer: {
    name: string;
    logoUrl: string;
  };
  formattedDate: string;
  formattedTime: string;
  location: string;
  capacity: number;
  registeredCount?: number;
  state: {
    label: string;
    color: 'success' | 'warning' | 'error' | 'info';
  };
  socialLinks?: Array<{
    icon: React.ReactNode;
    url: string;
    label: string;
  }>;
  attendees?: {
    count: number;
    avatars: string[];
    names: string;
  };
  onRegister?: () => void;
}

export function EventSummaryCard({
  organizer,
  formattedDate,
  formattedTime,
  location,
  capacity,
  registeredCount = 0,
  state,
  socialLinks = [],
  attendees,
  onRegister,
}: EventSummaryCardProps) {
  const theme = useTheme();
  const progressValue = (registeredCount / capacity) * 100;

  // Determinar color de la barra de progreso
  const getProgressColor = () => {
    if (progressValue >= 0.9) {
      return theme.palette.error.main;
    }
    if (progressValue >= 0.7) {
      return theme.palette.warning.main;
    }
    return theme.palette.success.main;
  };

  return (
    <Box sx={{ width: { xs: '100%', md: 340 } }}>
      <Box
        sx={{
          position: { md: 'sticky' },
          top: 24,
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={700}>
            Resumen
          </Typography>

          {/* Botón de Registro */}
          <Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<EventAvailableRoundedIcon />}
              onClick={onRegister}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              Registrarme
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center', display: 'block', mt: 1 }}
            >
              Registro gratuito • Confirmación inmediata
            </Typography>
          </Box>

          <Divider />

          {/* Organizado por */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={organizer.logoUrl}
                alt={organizer.name}
                sx={{ width: 18, height: 18 }}
              />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Organizado por
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: '0.9rem' }}
                >
                  {organizer.name}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Fecha y hora */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 0.5 }}>
              <CalendarTodayRoundedIcon
                sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }}
              />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Fecha y hora
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: '0.9rem' }}
                >
                  {formattedDate}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: '0.9rem' }}
                >
                  {formattedTime}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Ubicación */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <LocationOnRoundedIcon
                sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Ubicación
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ fontSize: '0.9rem' }}
                >
                  {location}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary.main,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Ver mapa
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Cupo */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <PeopleRoundedIcon
                sx={{ fontSize: 18, color: 'text.secondary', mt: 0.3 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Cupo
                </Typography>

                {/* Barra de progreso */}
                <Box sx={{ mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.divider, 0.3),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 1,
                        bgcolor: getProgressColor(),
                      },
                    }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {registeredCount} de {capacity} registrados
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Estado */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor:
                    state.color === 'success' ? theme.palette.success.main : theme.palette.info.main,
                  mt: 0.3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white' }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', mb: 0.5 }}
                >
                  Estado
                </Typography>
                <Chip
                  label={state.label}
                  color={state.color}
                  size="small"
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              </Box>
            </Stack>
          </Box>

          {/* Enlaces sociales */}
          {socialLinks.length > 0 && (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.75rem', mb: 1.5 }}
              >
                Enlaces sociales
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {socialLinks.map((link, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 0.75,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    {link.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          )}

          {/* Asistentes */}
          {attendees && (
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.75rem', mb: 1.5 }}
              >
                {attendees.count} Asistentes
              </Typography>
              <Stack direction="row" spacing={-1} sx={{ mb: 1.5 }}>
                {attendees.avatars.map((avatar, index) => (
                  <Avatar
                    key={index}
                    src={avatar}
                    sx={{
                      width: 32,
                      height: 32,
                      border: `2px solid ${theme.palette.background.paper}`,
                      '&:hover': {
                        zIndex: 10,
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                <strong>{attendees.names}</strong>
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
