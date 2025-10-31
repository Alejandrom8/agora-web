import React from 'react';
import { Box, Stack, Typography, Card, Chip, alpha } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
//import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { OrgEvent } from '@/lib/v1/types';

// -------------------------
// Active Event Card
// -------------------------
type ActiveEvent = {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  location: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  eventUrl?: string; // internal URL
  lumaUrl?: string; // external URL to Luma
};

export const activeEvent: ActiveEvent = {
  id: 'evt_001',
  title: 'AGORA | Demo Day & Networking',
  description:
    'Presentaciones de startups, panel de inversionistas y sesión de networking con founders, developers e inversionistas de la comunidad.',
  coverUrl:
    'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1600&auto=format&fit=crop',
  location: 'WeWork Artz Pedregal, CDMX',
  startAt: '2025-11-01T14:20:00-06:00',
  endAt: '2025-11-01T18:00:00-06:00',
  eventUrl: '/event/evt_001',
  lumaUrl: 'https://lu.ma/agora-demo-day',
};

const ActiveEventCard: React.FC<{ event: OrgEvent | undefined }> = ({ event }) => {
  if (!event) {
    return (
      <Card sx={{ p: 2, borderRadius: 3, boxShadow: 'none' }}>
        <Stack spacing={2}>
          {/* Cover skeleton */}
          <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 2 }} />

          {/* Location */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width="60%" />
          </Stack>

          {/* Title */}
          <Skeleton variant="text" width="80%" height={28} />

          {/* Date range */}
          <Stack spacing={1}>
            {[...Array(2)].map((_, i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                <Skeleton variant="circular" width={10} height={10} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="25%" />
              </Stack>
            ))}
          </Stack>

          {/* Description */}
          <Stack spacing={0.5}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} variant="text" width={`${100 - i * 10}%`} />
            ))}
          </Stack>
        </Stack>
      </Card>
    );
  }
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: 'none',
      }}
    >
      <Stack spacing={2}>
        {/* Cover */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: (t) => alpha(t.palette.common.white, 0.06),
          }}
        >
          <Box
            component="img"
            src={event?.cover_image || '/art_1.png'}
            alt={event?.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Chip
            label="Activo"
            color="primary"
            size="small"
            sx={{ position: 'absolute', top: 8, left: 8, borderRadius: 1.5 }}
          />
        </Box>

        {/* Location */}
        <Stack direction="row" spacing={1} alignItems="center">
          <PlaceOutlined fontSize="small" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {event?.location}
          </Typography>
        </Stack>

        {/* Title */}
        <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.1 }}>
          {event?.name}
        </Typography>

        {/* Date range */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {/* Inicio */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mr: 0.5,
              }}
            >
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'text.secondary' }} />
              <Box sx={{ flex: 1, width: 1, bgcolor: 'text.disabled', opacity: 0.4, my: 0.3 }} />
              <Box sx={{ flex: 1, width: 1, bgcolor: 'text.disabled', opacity: 0.4, my: 0.3 }} />
              <Box sx={{ flex: 1, width: 1, bgcolor: 'text.disabled', opacity: 0.4, my: 0.3 }} />
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: 'text.secondary',
                  bgcolor: 'transparent',
                }}
              />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Inicio
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Intl.DateTimeFormat('es-MX', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  }).format(new Date(event.start_at))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Intl.DateTimeFormat('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(event.start_at))}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  Fin
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Intl.DateTimeFormat('es-MX', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  }).format(new Date(event.end_at))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Intl.DateTimeFormat('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date(event.end_at))}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {event.description}
        </Typography>

        {/* Actions */}
        {/* <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {event.eventUrl && (
            <Button
              variant="outlined"
              size="small"
              component="a"
              href={event.eventUrl}
              sx={{ borderRadius: 2 }}
            >
              Ver evento
            </Button>
          )}
          {event.lumaUrl && (
            <Button
              variant="outlined"
              size="small"
              color="info"
              component="a"
              href={event.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<LaunchRounded />}
              sx={{ borderRadius: 2 }}
            >
              Luma
            </Button>
          )}
        </Stack> */}

      </Stack>
    </Card>
  );
};

export default ActiveEventCard;
