import React from 'react';
import { Box, Grid, Stack, Typography, Card, CardContent, Chip, alpha } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import EventRounded from '@mui/icons-material/EventRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import useSWR from 'swr';
import { EventStats } from '@/lib/v1/types';
// -------------------------
// Mock Data (replace with API calls)
// -------------------------

// Pie: Distribution by sub-event (top 5)
const subEventsDistribution = [
  { name: 'Keynote AI', value: 160 },
  { name: 'Pitch Stage A', value: 120 },
  { name: 'Pitch Stage B', value: 95 },
  { name: 'Workshops', value: 60 },
  { name: 'Networking', value: 47 },
];

// -------------------------
// Reusable components
// -------------------------

const KpiCard: React.FC<{
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  helper?: string;
  color?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}> = ({ label, value, icon, helper, color, children }) => {
  return (
    <Card
      sx={{
        minHeight: 140,
        elevation: 0,
        backgroundImage: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ '&:last-child': { paddingBottom: 2 } }}>
        <Stack spacing={1.25} alignItems="flex-start">
          {/* Icon pill */}
          {icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: (t) =>
                  alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.18 : 0.12),
              }}
            >
              {/* If an icon is provided, render it small; else render nothing */}
              {icon}
            </Box>
          )}

          {/* Label */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {label}
          </Typography>

          {/* Value */}
          {value !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.25 }}>
              <Typography variant="h5" fontWeight={800}>
                {value}
              </Typography>
            </Box>
          )}

          {helper && (
            <Chip
              size="small"
              label={helper}
              color={color === 'default' ? undefined : color}
              sx={{ mt: 0.5, width: 'fit-content' }}
            />
          )}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};

const EventAnalyticsSkeleton: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6 }}>
              <Card sx={{ minHeight: 140, borderRadius: 2, backgroundImage: 'none' }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <Card sx={{ minHeight: 220, borderRadius: 2, backgroundImage: 'none' }}>
          <CardContent>
            <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 180,
              }}
            >
              <Skeleton variant="circular" width={160} height={160} />
            </Box>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} variant="text" width={`${60 - i * 10}%`} />
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

interface EventAnalyticsProps {
  eventId: string | undefined;
}

export default function EventAnalytics({ eventId }: EventAnalyticsProps) {
  const theme = useTheme();
  const { data, isLoading } = useSWR<EventStats>(`/api/dashboard/event/${eventId}/summary`);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.info.main,
    alpha(theme.palette.primary.main, 0.7),
    alpha(theme.palette.info.main, 0.7),
    alpha(theme.palette.text.primary, 0.5),
  ];

  if (isLoading || !eventId) {
    return <EventAnalyticsSkeleton />;
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 7 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <KpiCard
              label="Asistentes totales"
              value={data?.total_attendees}
              icon={<PeopleAltRounded color="info" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <KpiCard
              label="Founders"
              value={data?.attendees_breakdown.founder}
              icon={<TrendingUpRounded color="info" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <KpiCard
              label="Sponsors"
              value={data?.attendees_breakdown.founder}
              icon={<EventRounded color="info" />}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <KpiCard
              label="Inversionistas"
              value={data?.attendees_breakdown?.investor}
              icon={<ShieldRounded color="info" />}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <KpiCard label="Asistentes por sub-evento">
          <Box sx={{ flex: 1, height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={subEventsDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={50}
                  paddingAngle={0}
                >
                  {subEventsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={40}
                  align="left"
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '10px',
                    textAlign: 'left',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </KpiCard>
      </Grid>
    </Grid>
  );
}
