import * as React from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import { withAuth } from '@/lib/withAuth';
import LoggedInNavBar from '@/components/App/LoggedInNavBar';
import { EventCard, EventCardSkeleton } from '@/components/Events/EventCard';
import { EventFilters } from '@/components/Events/EventFilters';
import { EventsHeader } from '@/components/Events/EventsHeader';
import { EventsPagination } from '@/components/Events/EventsPagination';
import { SkeletonGrid } from '@/components/Common/SkeletonGrid';
import { useEvents } from '@/hooks/useEvents';
import { useDebouncedState } from '@/hooks/useDebounce';
import { DEBOUNCE } from '@/config/constants';

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
  const [query, setQuery, debouncedQuery] = useDebouncedState('', DEBOUNCE.SEARCH);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

  // Fetch eventos con filtros y paginación
  const {
    events,
    isLoading,
    page,
    setPage,
    totalPages
  } = useEvents({
    q: debouncedQuery || undefined,
    categories_id: selectedCategoryId || undefined,
  });

  // Handler para limpiar filtros
  const clearAll = () => {
    setQuery('');
    setSelectedCategoryId(null);
  };

  return (
    <>
      <Head>
        <title>Eventos | Agora</title>
      </Head>

      <LoggedInNavBar user={{ name: 'Alex', organization: 'Let Her Pitch' }} />

      {/* Header */}
      <EventsHeader />

      <Box sx={{ pb: 6, minHeight: '100vh', backgroundColor: 'transparent' }}>
        <Container maxWidth="lg">
          {/* Filter/Search */}
          <EventFilters
            query={query}
            setQuery={setQuery}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
          />

          {/* Content */}
          {isLoading ? (
            <SkeletonGrid 
              count={6}
              columns={{ xs: 12, sm: 6, md: 4, lg: 4 }}
              SkeletonComponent={EventCardSkeleton}
            />
          ) : events.length === 0 ? (
            <EmptyState onReset={clearAll} />
          ) : (
            <>
              <Grid container spacing={3}>
                {events.map((ev) => (
                  <Grid key={ev.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                    <EventCard event={ev} />
                  </Grid>
                ))}
              </Grid>

              {/* Paginación */}
              {totalPages > 1 && (
                <EventsPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

export const getServerSideProps = withAuth();

export default EventsPage;
