import * as React from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  Skeleton,
  alpha,
  useTheme,
} from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { Event } from '@/lib/bff/types';

export interface EventCardData {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  capacity: number;
  categories: string[];
  date: string;
  time: string;
  location: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  isPublic: boolean;
  badge?: 'destacado' | 'popular' | 'nuevo';
  cupo?: number;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event: rawEvent }: EventCardProps) {
  const theme = useTheme();
  const event = mapEventToCardData(rawEvent);
  
  const badgeConfig = {
    destacado: { label: 'Destacado', color: theme.palette.error.main, icon: '⭐' },
    popular: { label: 'Popular', color: theme.palette.warning.main, icon: '🔥' },
    nuevo: { label: 'Nuevo', color: theme.palette.success.main, icon: '✨' },
  };

  const badge = event.badge ? badgeConfig[event.badge] : null;

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        borderColor: theme.palette.divider,
        borderRadius: 1.5,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: alpha(theme.palette.text.primary, 0.2),
          boxShadow: theme.custom.shadow.lg,
        },
      }}
    >
      <CardActionArea
        component={NextLink}
        href={`/event/${event.id}`}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Badge superior izquierdo */}
          {badge && (
            <Chip
              label={badge.label}
              icon={<span style={{ fontSize: '0.9rem' }}>{badge.icon}</span>}
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: badge.color,
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.75rem',
                zIndex: 2,
                boxShadow: `0 4px 12px ${alpha(badge.color, 0.5)}`,
                '& .MuiChip-label': {
                  px: 1.5,
                },
                '& .MuiChip-icon': {
                  marginLeft: '8px',
                  marginRight: '-4px',
                  color: '#FFFFFF',
                },
              }}
            />
          )}

          {/* Imagen de portada */}
          <Box
            sx={{
              position: 'relative',
              height: 220,
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <Image
              src={event.coverUrl}
              alt={event.title}
              fill
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
              style={{
                objectFit: 'cover'
              }}
              priority={false}
            />
          </Box>

          {/* Botón de favorito TODO: Implementar lógica de like cuando se tenga el endpoint */}
          {/* <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 3,
            }}
          >
            <Box
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implementar lógica de like
                console.log('Like evento:', event.id);
              }}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: alpha('#000000', 0.5),
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: alpha('#000000', 0.7),
                  transform: 'scale(1.1)',
                },
              }}
            >
              <FavoriteBorderRoundedIcon 
                sx={{ 
                  fontSize: 20, 
                  color: '#FFFFFF',
                }} 
              />
            </Box>
          </Box> */}
        </Box>

        <CardContent
          sx={{
            p: 2.5,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {/* Contenido principal */}
          <Stack spacing={1.5}>
            {/* Categorías */}
            {event.categories.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                {event.categories.slice(0, 2).map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      color: theme.palette.info.main,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      height: 26,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Título */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                lineHeight: 1.3,
                fontSize: '1.125rem',
                color: theme.palette.text.primary,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {event.title}
            </Typography>

            {/* Descripción */}
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {event.description}
            </Typography>

            {/* Fecha, Hora y Ubicación */}
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.875rem',
              }}
            >
              <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {event.date}
              </Typography>
              <Box component="span" sx={{ mx: 0.5 }}>•</Box>
              <AccessTimeRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {event.time}
              </Typography>
              <Box component="span" sx={{ mx: 0.5 }}>•</Box>
              <LocationOnRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {event.location}
              </Typography>
            </Stack>

            {/* Organizador y Footer combinados */}
            <Stack 
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 'auto' }}
            >
              {/* Organizador */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                <Avatar
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: alpha(theme.palette.text.primary, 0.1),
                    fontSize: '0.875rem',
                  }}
                >
                  {event.organizer.name.charAt(0)}
                </Avatar>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {event.organizer.name}
                </Typography>
              </Stack>

              {/* Cupo y isPublic */}
              <Stack alignItems="flex-end" spacing={0.25}>
                <Typography
                  variant="caption"
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    fontWeight: 400,
                    fontSize: '0.75rem',
                  }}
                >
                  Cupo: {event.cupo || event.capacity}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: event.isPublic ? theme.palette.success.main : theme.palette.info.main,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                  }}
                >
                  {event.isPublic ? 'Público' : 'Privado'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/**
 * Helper para mapear Event del API a EventCardData
 * 
 * @param event - Evento del API
 * @returns Datos formateados para EventCard
 */
export function mapEventToCardData(event: Event): EventCardData {
  // Formatear fecha y hora
  const startDate = new Date(event.start_at);
  const date = startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const time = startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Imagen de portada: usar cover_image o fallback
  const coverUrl = event.cover_image || 
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop';

  return {
    id: event.id,
    title: event.name,
    description: event.description,
    coverUrl,
    capacity: event.capacity,
    cupo: event.capacity, // Por ahora igual a capacity
    categories: [], // Por ahora vacío hasta que tengamos la relación con categorías
    date,
    time,
    location: event.location,
    organizer: {
      name: event.organization.name,
      avatar: event.organization.logo_url,
    },
    isPublic: event.is_public,
  };
}

/**
 * Skeleton loading state para EventCard
 */
export function EventCardSkeleton() {
  const theme = useTheme();
  
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        overflow: 'hidden',
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        borderColor: theme.palette.divider,
        borderRadius: 3,
      }}
    >
      <Skeleton 
        variant="rectangular" 
        height={220} 
        sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} 
      />
      <Box sx={{ p: 2.5 }}>
        {/* Chips de categorías */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Skeleton 
            width={60} 
            height={26} 
            sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2 }} 
          />
          <Skeleton 
            width={80} 
            height={26} 
            sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2 }} 
          />
        </Stack>
        {/* Título */}
        <Skeleton 
          width="85%" 
          height={28} 
          sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), mb: 0.5 }} 
        />
        <Skeleton 
          width="70%" 
          height={28} 
          sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), mb: 1.5 }} 
        />
        {/* Descripción */}
        <Skeleton 
          width="95%" 
          sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), mb: 0.5 }} 
        />
        <Skeleton 
          width="80%" 
          sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), mb: 1.5 }} 
        />
        {/* Fecha/hora/ubicación */}
        <Skeleton 
          width="100%" 
          sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05), mb: 2 }} 
        />
        {/* Footer con organizador */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Skeleton
              variant="circular"
              width={32}
              height={32}
              sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }}
            />
            <Skeleton 
              width={100} 
              sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} 
            />
          </Stack>
          <Stack alignItems="flex-end">
            <Skeleton 
              width={60} 
              sx={{ bgcolor: alpha(theme.palette.text.primary, 0.05) }} 
            />
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
