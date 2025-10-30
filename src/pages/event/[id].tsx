import * as React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
} from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LanguageIcon from '@mui/icons-material/Language';
import { Event } from '@/lib/bff/types';
import { withAuth } from '@/lib/withAuth';
import { bffClient } from '@/lib/clients/bff';
import { EventCover } from '@/components/Events/EventCover';
import { EventDetailHeader } from '@/components/Events/EventDetailHeader';
import { EventSummaryCard } from '@/components/Events/EventSummaryCard';
import { SponsorCard } from '@/components/Events/SponsorCard';

type EventPageProps = {
  event: Event;
}

export default function EventPage({ event }: EventPageProps) {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = React.useState('detalles');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  // Formatear fechas
  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);
  const formattedDate = startDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = `${startDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${endDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  // Estado badge config
  const stateConfig: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'info' }> = {
    active: { label: 'Activo', color: 'success' },
    upcoming: { label: 'Próximamente', color: 'info' },
    cancelled: { label: 'Cancelado', color: 'error' },
    completed: { label: 'Finalizado', color: 'warning' },
  };

  const currentState = stateConfig[event.state] || { label: event.state, color: 'info' };

  // Social links filter
  const socialLinks = event.social_links ? [
    { icon: <InstagramIcon />, url: event.social_links.instagram, label: 'Instagram' },
    { icon: <LinkedInIcon />, url: event.social_links.linkedin, label: 'LinkedIn' },
    { icon: <XIcon />, url: event.social_links.x, label: 'X (Twitter)' },
    { icon: <FacebookIcon />, url: event.social_links.facebook, label: 'Facebook' },
    { icon: <YouTubeIcon />, url: event.social_links.youtube, label: 'YouTube' },
    { icon: <LanguageIcon />, url: event.social_links.website, label: 'Website' },
  ].filter((link) => link.url) : [];

  return (
    <>
      <Head>
        <title>{`${event.name} | Agora`}</title>
        <meta name="description" content={event.description} />
        <meta property="og:title" content={event.name} />
        <meta property="og:description" content={event.description} />
        {event.cover_image && <meta property="og:image" content={event.cover_image} />}
      </Head>

      {/* Cover Image */}
      <EventCover coverImage={event.cover_image} eventName={event.name} />

      {/* Tabs Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            aria-label="event navigation tabs"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 56,
              },
            }}
          >
            <Tab label="Detalles" value="detalles" />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Agenda</span>
                  <Chip 
                    label="Próximamente" 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.65rem',
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }} 
                  />
                </Stack>
              } 
              value="agenda" 
              disabled
            />
            <Tab 
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Sub-eventos</span>
                  <Chip 
                    label="Próximamente" 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.65rem',
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }} 
                  />
                </Stack>
              } 
              value="sub-eventos" 
              disabled 
            />
          </Tabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ bgcolor: theme.palette.background.default, pb: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            {/* Layout de 2 columnas: Contenido + Resumen */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
              {/* Left Column - Tab Content */}
              <Box sx={{ flex: 1 }}>
                {/* Tab Content: Detalles */}
                {currentTab === 'detalles' && (
                  <Box>
                <EventDetailHeader
                  title={event.name}
                  formattedDate={formattedDate}
                  formattedTime={formattedTime}
                  location={event.location}
                  isPublic={event.is_public}
                />

                {/* Description Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Acerca del evento
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}
                  >
                    {event.description}
                  </Typography>
                </Box>

                {/* Sponsors */}
                {event.sponsors.length > 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      Patrocinadores ({event.sponsors_count})
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 1.5,
                      }}
                    >
                      {event.sponsors.map((sponsor, index) => (
                        <SponsorCard key={sponsor.id} sponsor={sponsor} colorIndex={index} />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
                )}

                {/* Tab Content: Agenda (Placeholder) */}
                {currentTab === 'agenda' && (
                  <Box sx={{ py: 8 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                      Agenda del Evento
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Esta sección estará disponible próximamente.
                    </Typography>
                  </Box>
                )}

                {/* Tab Content: Sub-eventos (Placeholder) */}
                {currentTab === 'sub-eventos' && (
                  <Box sx={{ py: 8 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                      Sub-eventos
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Esta sección estará disponible próximamente.
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Right Column - Sticky Card (Resumen) - Siempre Visible */}
              <EventSummaryCard
                organizer={{
                  name: event.organization.name,
                  logoUrl: event.organization.logo_url,
                }}
                formattedDate={formattedDate}
                formattedTime={formattedTime}
                location={event.location}
                capacity={event.capacity}
                registeredCount={4}
                state={currentState}
                socialLinks={socialLinks}
                attendees={{
                  count: 18,
                  avatars: [
                    'https://i.pravatar.cc/150?img=1',
                    'https://i.pravatar.cc/150?img=2',
                    'https://i.pravatar.cc/150?img=3',
                    'https://i.pravatar.cc/150?img=4',
                    'https://i.pravatar.cc/150?img=5',
                  ],
                  names: 'Ander Álvarez Galicia, Leopoldo Misael y 16 más',
                }}
              />
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<EventPageProps> = withAuth<EventPageProps>(
  async (ctx) => {
    const { id } = ctx.params as { id: string };

    try {
      // Llamamos al BFF con las cookies del usuario para autenticación
      const event = await bffClient.get<Event>(`/api/events/${id}`, {
        cookie: ctx.req.headers.cookie || '',
      });

      if (!event) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          event,
        },
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return {
        notFound: true,
      };
    }
  }
);

