import React from 'react';
import {
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  alpha,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EventRounded from '@mui/icons-material/EventRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import AddIcon from '@mui/icons-material/Add';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Organization } from '@/lib/v1/types';

// -------------------------
// Mock Data (replace with API calls)
// -------------------------

// KPIs per selected event (could also be aggregated)
const getKpis = () => ({
  totalAttendees: 482,
  totalFounders: 164,
  totalInvestors: 76,
  totalSessions: 18,
  mfaRequired: 1, // number of roles with MFA requirement
  growth7d: 12.4, // % growth last 7 days
});

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

// Bar: Attendees by role (for selected event)
const attendeesByRole = [
  { role: 'Founders', count: 164 },
  { role: 'Inversionistas', count: 76 },
  { role: 'Tecnólogos', count: 120 },
  { role: 'Asistentes', count: 122 },
];

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
  value: string | number;
  icon?: React.ReactNode;
  helper?: string;
  color?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
}> = ({ label, value, icon, helper, color = 'default' }) => (
  <Card
    sx={{
      backgroundColor: 'transparent',
      elevation: 0,
      boxShadow: 'none',
      backgroundImage: 'none',
    }}
  >
    <CardContent>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        {icon}
      </Stack>
      <Typography variant="h4" fontWeight={900}>
        {value}
      </Typography>
      {helper && (
        <Chip
          size="small"
          label={helper}
          color={color === 'default' ? undefined : color}
          sx={{ mt: 1, width: 'fit-content' }}
        />
      )}
    </CardContent>
  </Card>
);

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

// Simple export to CSV (mock)
const exportCSV = (rows: object[], filename = 'agora_export.csv') => {
  const headers = Object.keys(rows[0] ?? {});
  const csv = [headers.join(',')]
    .concat(rows.map((r) => headers.map((h) => JSON.stringify((r as never)[h] ?? '')).join(',')))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Small helper for tips
const Tip: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <Box
    sx={{
      p: 1.25,
      borderRadius: 1.5,
      backgroundColor: () => alpha('#FFFFFF', 0.04),
      border: () => `1px solid ${alpha('#FFFFFF', 0.08)}`,
    }}
  >
    <Typography variant="subtitle2" fontWeight={800}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {body}
    </Typography>
  </Box>
);

interface OrganizationManagementProps {
  org: Organization;
}

export default function OrganizationManagement({ org }: OrganizationManagementProps) {
  const theme = useTheme();
  // const [range, setRange] = useState<string>('7d');

  const kpis = React.useMemo(() => getKpis(), []);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.info.main,
    alpha(theme.palette.primary.main, 0.7),
    alpha(theme.palette.info.main, 0.7),
    alpha('#FFFFFF', 0.5),
  ];

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
          {/* <EventSelector orgId={org?.id} /> */}
          {/* <ToggleButtonGroup
            exclusive
            size="small"
            value={range}
            onChange={(_, v) => v && setRange(v)}
          >
            <ToggleButton value="7d">7d</ToggleButton>
            <ToggleButton value="14d">14d</ToggleButton>
            <ToggleButton value="30d">30d</ToggleButton>
          </ToggleButtonGroup> */}
        </Stack>
      </Stack>

      {/* KPIs */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Asistentes totales"
            value={kpis.totalAttendees}
            icon={<PeopleAltRounded color="info" />}
            helper={`+${kpis.growth7d}% vs 7d`}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Founders"
            value={kpis.totalFounders}
            icon={<TrendingUpRounded color="info" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Inversionistas"
            value={kpis.totalInvestors}
            icon={<ShieldRounded color="info" />}
            helper={kpis.mfaRequired ? 'MFA activo' : undefined}
            color={kpis.mfaRequired ? 'warning' : 'default'}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard
            label="Sub-eventos"
            value={kpis.totalSessions}
            icon={<EventRounded color="info" />}
          />
        </Grid>
      </Grid>

      {/* Charts Row 2: Pie + Table-like export */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <CardSection
            title="Eventos activos"
            subtitle="Acciones sugeridas"
            action={
              <Button color="primary" variant="contained" startIcon={<AddIcon />}>
                Crear nuevo
              </Button>
            }
          >
            <Stack spacing={1.25}>
              <Tip
                title="Activa MFA para inversionistas"
                body="Requisito en 1 rol. Mejora la seguridad del acceso a sub-eventos de alto impacto."
              />
              <Tip
                title="Invita a tus speakers por lote"
                body="Carga un CSV con tus ponentes y automatiza los correos de invitación."
              />
              <Tip
                title="Habilita registro por sesión"
                body="Permite medir demanda y controlar aforo por taller o pitch stage."
              />
            </Stack>
          </CardSection>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <CardSection title="Registros por día" subtitle="Últimos 14 días">
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart
                  data={seriesCombined}
                  margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                  width={400}
                  height={250}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#FFFFFF', 0.08)} />
                  <XAxis dataKey="day" stroke={alpha('#FFFFFF', 0.5)} tickMargin={8} />
                  <YAxis stroke={alpha('#FFFFFF', 0.5)} />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                    }}
                  />
                  {/* Primera línea */}
                  <Line
                    type="monotone"
                    dataKey="countA"
                    stroke={theme.palette.info.main}
                    strokeWidth={2}
                    dot={false}
                    name="Registro A"
                  />
                  {/* Segunda línea */}
                  <Line
                    type="monotone"
                    dataKey="countB"
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    dot={false}
                    name="Registro B"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardSection>
        </Grid>
      </Grid>

      {/* Charts Row 1: Line + Bar */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <CardSection
            title="Asistencia por sub-evento"
            subtitle="Top 5 sesiones"
            action={
              <Button
                size="small"
                variant="outlined"
                startIcon={<DownloadRounded />}
                onClick={() => exportCSV(subEventsDistribution, 'subevent_distribution.csv')}
              >
                Exportar CSV
              </Button>
            }
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              gap={2}
              alignItems={{ xs: 'center', md: 'stretch' }}
            >
              <Box sx={{ flex: 1, height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={subEventsDistribution}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={4}
                    >
                      {subEventsDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                    <Tooltip
                      contentStyle={{
                        background: theme.palette.background.paper,
                        border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Divider
                flexItem
                orientation="vertical"
                sx={{ display: { xs: 'none', md: 'block' }, opacity: 0.12 }}
              />
              <Box sx={{ flex: 1 }}>
                <Stack spacing={1.25}>
                  {subEventsDistribution.map((s, i) => (
                    <Stack
                      key={s.name}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ p: 1, borderRadius: 1, backgroundColor: alpha('#FFFFFF', 0.03) }}
                    >
                      <Stack direction="row" alignItems="center" gap={1.25}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: 0.5,
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                        <Typography>{s.name}</Typography>
                      </Stack>
                      <Chip size="small" label={s.value} />
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </CardSection>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <CardSection title="Asistentes por rol" subtitle="Distribución actual">
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={attendeesByRole} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha('#FFFFFF', 0.08)} />
                  <XAxis dataKey="role" stroke={alpha('#FFFFFF', 0.5)} tickMargin={8} />
                  <YAxis stroke={alpha('#FFFFFF', 0.5)} />
                  <Tooltip
                    contentStyle={{
                      background: theme.palette.background.paper,
                      border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                    }}
                  />
                  <Bar dataKey="count" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardSection>
        </Grid>
      </Grid>
    </Stack>
  );
}
