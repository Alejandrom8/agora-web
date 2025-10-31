import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography, Card, CardContent, alpha, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import LibraryAddRounded from '@mui/icons-material/LibraryAddRounded';
import PersonAddAlt1Rounded from '@mui/icons-material/PersonAddAlt1Rounded';
import GroupAddRounded from '@mui/icons-material/GroupAddRounded';
import { Organization, OrgEvent } from '@/lib/v1/types';
import EventSelector from './EventSelector';
import ActiveEventCard from './ActiveEvent';
import OrgMembersCard from './OrgMembersCard';
import { useRouter } from 'next/router';
import EventAnalytics from './EventAnalytics';
import useSWR from 'swr';

// Time series: Registrations per day (last 14 days)
const seriesCombined = [
  { day: '09-11', countA: 18, countB: 0 },
  { day: '09-12', countA: 22, countB: 4 },
  { day: '09-13', countA: 20, countB: 12 },
  { day: '09-14', countA: 25, countB: 13 },
  { day: '09-15', countA: 19, countB: 15 },
  { day: '09-16', countA: 28, countB: 15 },
  { day: '09-17', countA: 31, countB: 15 },
  { day: '09-18', countA: 26, countB: 17 },
  { day: '09-19', countA: 34, countB: 18 },
  { day: '09-20', countA: 38, countB: 30 },
  { day: '09-21', countA: 30, countB: 34 },
  { day: '09-22', countA: 27, countB: 35 },
  { day: '09-23', countA: 41, countB: 36 },
  { day: '09-24', countA: 43, countB: 36 },
];

const CardSection: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, action, children }) => (
  <Card
    sx={{
      backgroundColor: 'transparent',
      elevation: 0,
      boxShadow: 'none',
      backgroundImage: 'none',
    }}
  >
    <CardContent>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        width="100%"
        sx={{ mb: 2 }}
      >
        <Box sx={{ width: '100%' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={{
              mb: subtitle ? 0.25 : 0,
            }}
          >
            <Stack direction={'column'}>
              <Typography variant="h6" fontWeight={800}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Stack>
            {action && <Box sx={{ ml: 0.5 }}>{action}</Box>}
          </Stack>
        </Box>
      </Stack>
      {children}
    </CardContent>
  </Card>
);

interface OrganizationManagementProps {
  org: Organization;
}

export default function OrganizationManagement({ org }: OrganizationManagementProps) {
  const theme = useTheme();
  const router = useRouter();
  const { data: activeEvent } = useSWR<OrgEvent>(
    `/api/dashboard/org/${org?.id}/events?active=true`,
  );
  const [currentEvent, setCurrentEvent] = useState<OrgEvent | undefined>();

  const handleChangeSelectedEvent = (data: OrgEvent) => {
    setCurrentEvent(data);
  };

  useEffect(() => {
    if (activeEvent) setCurrentEvent(activeEvent);
  }, [activeEvent]);

  const barData = React.useMemo(
    () =>
      seriesCombined.map((d) => ({
        day: d.day,
        event: d.countA,            // evento principal (mock)
        sub1: Math.max(0, Math.round(d.countA * 0.55)), // sub-evento A (mock)
        sub2: d.countB,             // sub-evento B (mock)
      })),
    []
  );

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            {org?.name}
          </Typography>
          <Typography color="text.secondary">Panel analítico de tu organizacion</Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <EventSelector orgId={org?.id} onEventChanged={handleChangeSelectedEvent} />
          <Button color="primary" variant="contained" startIcon={<EditIcon />}>
            Editar evento
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/** Left Side */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack direction={'column'} spacing={2}>
            <CardSection title="✨ Evento activo">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                  <ActiveEventCard event={currentEvent} />
                  {/* Quick Actions */}
                  <Box sx={{ mt: 1.5 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Acciones rápidas
                    </Typography>
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CalendarMonthRounded />}
                        onClick={() => {
                          /* TODO: open agenda editor */
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Editar agenda
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<LibraryAddRounded />}
                        onClick={() => {
                          /* TODO: open create sub-event */
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Agregar sub-evento
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PersonAddAlt1Rounded />}
                        onClick={() => {
                          /* TODO: open add attendee */
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Agregar asistente
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<GroupAddRounded />}
                        onClick={() => {
                          /* TODO: open add staff member */
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Agregar miembro
                      </Button>
                    </Stack>
                  </Box>
                  {/* End Quick Actions */}
                </Grid>
              </Grid>
            </CardSection>
            <OrgMembersCard orgId={org?.id} onWatchAll={() => router.push(`/org/${org.id}/team`)} />
          </Stack>
        </Grid>

        {/** Right Side */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack direction="column" spacing={2}>
            {/* KPIs */}
            <EventAnalytics eventId={currentEvent?.id} />

            {/* Charts Row 2: Pie + Table-like export */}
            <Grid container spacing={2}>
              <Grid size={12}>
                <CardSection title="Registros por día" subtitle="Últimos 14 días">
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={barData}
                        margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                        width={400}
                        height={250}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.08)} />
                        <XAxis dataKey="day" stroke={alpha(theme.palette.text.primary, 0.5)} tickMargin={8} />
                        <YAxis stroke={alpha(theme.palette.text.primary, 0.5)} />
                        <Tooltip
                          contentStyle={{
                            background: theme.palette.background.paper,
                            border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Bar dataKey="sub1" name="Sub‑evento A" stackId="a" fill={theme.palette.primary.main} radius={[4,4,0,0]} />
                        <Bar dataKey="sub2" name="Sub‑evento B" stackId="a" fill={theme.palette.success.main} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardSection>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
