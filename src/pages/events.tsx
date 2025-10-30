import * as React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded';
import { alpha } from '@mui/material/styles';
import { withAuth } from '@/lib/withAuth';
import LoggedInNavBar from '@/components/App/LoggedInNavBar';

/**
 * Types
 */
interface EventItem {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  capacity: number;
  categories: string[];
}

/**
 * Mock fetch — replace with your real API call
 */
async function fetchEventsMock(): Promise<EventItem[]> {
  await new Promise((r) => setTimeout(r, 900));
  return [
    {
      id: 'agora-001',
      title: 'React & Coffee – CDMX',
      description:
        'Meetup para frontend lovers: charlas cortas, live-coding y networking con buena vibra.',
      coverUrl:
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1600&auto=format&fit=crop',
      capacity: 120,
      categories: ['Tech', 'Frontend', 'Meetup'],
    },
    {
      id: 'agora-002',
      title: 'Diseño de Producto: de idea a MVP',
      description: 'Workshop práctico para aterrizar tus ideas en un MVP funcional con foco en UX.',
      coverUrl:
        'https://images.unsplash.com/photo-1529336953121-ad5a0d43d0d2?q=80&w=1600&auto=format&fit=crop',
      capacity: 60,
      categories: ['Product', 'UX', 'Workshop'],
    },
    {
      id: 'agora-003',
      title: 'Data & AI Night',
      description:
        'Charlas lightning sobre IA aplicada, casos de uso reales y demos de la comunidad.',
      coverUrl:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
      capacity: 200,
      categories: ['AI', 'Data', 'Tech'],
    },
  ];
}

/**
 * Glassy Filter Bar
 */
function FilterBar({
  query,
  setQuery,
  selected,
  setSelected,
  onClear,
}: {
  query: string;
  setQuery: (v: string) => void;
  selected: string[];
  setSelected: (v: string[]) => void;
  onClear: () => void;
}) {
  const glass = {
    backgroundColor: alpha('#0B0D12', 0.35),
    border: `1px solid ${alpha('#FFFFFF', 0.14)}`,
    backdropFilter: 'saturate(140%) blur(10px)',
    borderRadius: 2,
  } as const;

  const categories = ['Tech', 'Frontend', 'Meetup', 'Product', 'UX', 'Workshop', 'AI', 'Data'];

  const handleToggle = (_: any, values: string[]) => setSelected(values || []);

  return (
    <Box sx={{ ...glass, p: { xs: 1, sm: 1.5 }, mb: 3 }}>
      <Stack spacing={1.25}>
        <TextField
          fullWidth
          placeholder="Buscar eventos, ciudades, hosts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            sx: {
              bgcolor: alpha('#FFFFFF', 0.06),
              borderRadius: 8,
              '& fieldset': { borderColor: alpha('#FFFFFF', 0.15) },
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton size="small" onClick={onClear} aria-label="Limpiar búsqueda">
                    <ClearRoundedIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />

        <Divider sx={{ borderColor: alpha('#FFFFFF', 0.08) }} />

        <ToggleButtonGroup
          value={selected}
          onChange={handleToggle}
          size="small"
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButton-root': {
              border: `1px solid ${alpha('#FFFFFF', 0.18)}`,
              bgcolor: alpha('#FFFFFF', 0.06),
              borderRadius: 999,
              textTransform: 'none',
            },
          }}
        >
          {categories.map((c) => (
            <ToggleButton key={c} value={c} aria-label={c}>
              {c}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}

/**
 * Event Card
 */
function EventCard({ ev }: { ev: EventItem }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        bgcolor: 'transparent',
        borderColor: () => alpha('#FFFFFF', 0.12),
        overflow: 'hidden',
      }}
    >
      <CardActionArea component={NextLink} href={`/event/${ev.id}`}>
        <CardMedia
          component="img"
          image={ev.coverUrl}
          alt={ev.title}
          sx={{ height: 200, objectFit: 'cover', filter: 'saturate(105%)' }}
        />
        <CardContent sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {ev.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {ev.description}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <EventSeatRoundedIcon fontSize="small" />
              <Typography variant="caption">Cupo: {ev.capacity}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {ev.categories.map((cat) => (
                <Chip key={cat} label={cat} size="small" variant="outlined" />
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/**
 * Loading Grid
 */
function LoadingGrid() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <Card variant="outlined" sx={{ height: '100%', overflow: 'hidden' }}>
            <Skeleton variant="rectangular" height={180} />
            <Box sx={{ p: 2 }}>
              <Skeleton width="70%" />
              <Skeleton width="40%" />
              <Skeleton width="85%" />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/**
 * Empty State
 */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        No encontramos eventos con esos filtros
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 3 }}>
        Intenta ajustar tu búsqueda o explora otras categorías.
      </Typography>
      <Chip label="Limpiar filtros" onClick={onReset} clickable variant="outlined" />
    </Box>
  );
}

/**
 * Page
 */
function EventsPage() {
  const [loading, setLoading] = React.useState(true);
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);

  React.useEffect(() => {
    let active = true;
    fetchEventsMock().then((data) => {
      if (active) {
        setEvents(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = events.filter((ev) => {
    const matchesQuery = normalizedQuery
      ? `${ev.title} ${ev.description} ${ev.categories.join(' ')}`
          .toLowerCase()
          .includes(normalizedQuery)
      : true;
    const matchesCats = selected.length ? selected.every((c) => ev.categories.includes(c)) : true;
    return matchesQuery && matchesCats;
  });

  const clearAll = () => {
    setQuery('');
    setSelected([]);
  };

  return (
    <>
      <Head>
        <title>Eventos | Agora</title>
      </Head>

      <LoggedInNavBar user={{ name: 'Alex', organization: 'Let Her Pitch' }} />

      <Box sx={{ pt: { xs: 2, md: 4 }, minHeight: '100vh', backgroundColor: 'transparent' }}>
        <Container maxWidth="lg">
          {/* Filter/Search */}
          <FilterBar
            query={query}
            setQuery={setQuery}
            selected={selected}
            setSelected={setSelected}
            onClear={clearAll}
          />

          {/* Content */}
          {loading ? (
            <LoadingGrid />
          ) : filtered.length === 0 ? (
            <EmptyState onReset={clearAll} />
          ) : (
            <Grid container spacing={2}>
              {filtered.map((ev) => (
                <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <EventCard ev={ev} />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps = withAuth();

export default EventsPage;
