// Agora App Layout — Responsive Drawer + Auth-guard (Material UI 5 + TypeScript)
// Works with Next.js App Router or Pages Router. Includes:
// - Left Drawer: logo top, nav in the middle, user bar bottom with avatar + settings
// - Right Panel: renders page content
// - Responsive: temporary drawer on mobile, permanent on desktop
// - Auth pattern: ProtectedLayout that only renders for authenticated users
//
// Usage (App Router):
// 1) Create this file as `app/(app)/_components/AgoraLayout.tsx` (or anywhere you prefer).
// 2) Wrap your authenticated routes inside a segment using this layout, e.g. `app/(app)/layout.tsx`.
// 3) Replace the mock `useAuth()` with your preferred auth (NextAuth/useSession, custom JWT, etc.).

import * as React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Stack,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useRouter, usePathname } from 'next/navigation';
import Diversity3RoundedIcon from '@mui/icons-material/Diversity3Rounded';
import ExtensionRoundedIcon from '@mui/icons-material/ExtensionRounded';

// Util logo
import TypoLogo from '../App/TypoLogo';
import Head from 'next/head';
import { useSession } from '@/hooks/useSession';
import { User, UserRole } from '@/lib/v1/types';
import { useMemo } from 'react';

// ------- Mock auth hook (replace with NextAuth or your auth) -------
// Example with NextAuth:
// import { useSession, signOut } from "next-auth/react";
// const useAuth = () => {
//   const { data, status } = useSession();
//   return { user: data?.user ?? null, loading: status === "loading", signOut };
// };

// ------- Layout constants -------
const DRAWER_WIDTH = 230;

// ------- Nav config (contextual) -------
// Context & rules
type AppCtx = {
  roles: Array<UserRole>;
  orgId?: string;
  activeEventId?: string; // undefined si no hay evento
};

type Predicate = (ctx: AppCtx) => boolean;
type HrefBuilder = (ctx: AppCtx) => string;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href?: string; // estático
  buildHref?: HrefBuilder; // dinámico (usa eventId, etc.)
  allowedRoles?: Array<UserRole>; // RBAC
  visibleIf?: Predicate; // visibilidad condicional
  disabledIf?: Predicate; // deshabilitar condicional
}
interface NavGroup {
  title: string;
  items: NavItem[];
  visibleIf?: Predicate;
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Esenciales',
    items: [
      { label: 'Inicio', icon: <DashboardRoundedIcon />, href: '/org' },
      {
        label: 'Mis eventos',
        icon: <EventRoundedIcon />,
        allowedRoles: ['owner', 'member'],
        buildHref: ({ orgId }) => `/org/${orgId}/events`,
      },
      {
        label: 'Evento actual',
        icon: <EventRoundedIcon />,
        buildHref: ({ activeEventId, orgId }) => `/org/${orgId}/event/${activeEventId}`,
        visibleIf: ({ activeEventId }) => Boolean(activeEventId),
      },
    ],
  },
  {
    title: 'Operación',
    items: [
      {
        label: 'Agenda',
        icon: <EventRoundedIcon />,
        buildHref: ({ activeEventId, orgId }) => `/org/${orgId}/event/${activeEventId}/agenda`,
        allowedRoles: ['owner', 'member'],
        disabledIf: ({ activeEventId }) => !activeEventId,
      },
      {
        label: 'Sub-eventos',
        icon: <EventRoundedIcon />,
        buildHref: ({ activeEventId, orgId }) => `/org/${orgId}/event/${activeEventId}/subevents`,
        allowedRoles: ['owner', 'member'],
        disabledIf: ({ activeEventId }) => !activeEventId,
      },
      {
        label: 'Asistentes',
        icon: <PeopleAltRoundedIcon />,
        buildHref: ({ activeEventId, orgId }) => `/org/${orgId}/event/${activeEventId}/attendees`,
        allowedRoles: ['owner', 'member'],
        disabledIf: ({ activeEventId }) => !activeEventId,
      },
      {
        label: 'Sponsors',
        icon: <Diversity3RoundedIcon />,
        buildHref: ({ activeEventId, orgId }) => `/org/${orgId}/event/${activeEventId}/sponsors`,
        allowedRoles: ['owner', 'member'],
        visibleIf: ({ activeEventId }) => Boolean(activeEventId),
      },
      // { label: 'Comunicaciones', href: '/manage/comms', icon: <MailOutlineRoundedIcon /> },
      // { label: 'Recursos', href: '/manage/resources', icon: <FolderRoundedIcon /> },
    ],
  },
  // {
  //   title: 'Crecimiento',
  //   items: [
  //     { label: 'Analítica', href: '/manage/analytics', icon: <AssessmentRoundedIcon /> },
  //     { label: 'Feedback & Encuestas', href: '/manage/feedback', icon: <PollRoundedIcon /> },
  //     { label: 'Reportes', href: '/manage/reports', icon: <UploadFileRoundedIcon /> },
  //   ],
  // },
  {
    title: 'Administración',
    items: [
      {
        label: 'Equipo y Roles',
        icon: <PeopleAltRoundedIcon />,
        href: '/manage/team',
        allowedRoles: ['owner'],
      },
      {
        label: 'Integraciones',
        icon: <ExtensionRoundedIcon />,
        href: '/manage/integrations',
        allowedRoles: ['owner', 'member'],
      },
      // { label: 'Configuración', href: '/settings/organization', icon: <TuneRoundedIcon /> },
      // { label: 'Facturación', href: '/settings/billing', icon: <CreditCardRoundedIcon /> },
      // { label: 'Ayuda & Soporte', href: '/help', icon: <HelpOutlineRoundedIcon /> },
    ],
  },
];

const Logo: React.FC = () => <TypoLogo />;

// ------- ProtectedLayout --------
// Renders children only if the user is authenticated; otherwise show a sign-in CTA or redirect.
export const ProtectedLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title = 'Dashboard',
}) => {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center' }}>
        <Typography color="text.secondary">Cargando…</Typography>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{`${title} | Agora`}</title>
      </Head>
      <AppLayout user={user}>{children}</AppLayout>
    </>
  );
};
// ------- AppLayout --------
export const AppLayout: React.FC<{ user: User | null; children: React.ReactNode }> = ({
  user,
  children,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = React.useState(false);
  // const { data: activeEvent } = useSWR<OrgEvent>(
  //   `/api/dashboard/org/${user?.organizations?.[0]?.id}/events?active=true`,
  // );

  const pathname = usePathname();

  // TODO: Conectar con tu store/swr real. Para ahora, usa un valor opcional.
  const activeEventId = useMemo(() => '6902c28929fee86059af6e91', []);

  // Derivar roles desde la sesión (acepta user.role o user.roles)
  const roles = React.useMemo(() => {
    const rs = [user?.organizations?.[0]?.role];
    return Array.isArray(rs) ? (rs as AppCtx['roles']) : [];
  }, [user]);

  const ctx: AppCtx = React.useMemo(
    () => ({ roles, activeEventId, orgId: user?.organizations?.[0]?.id }),
    [roles, user, activeEventId],
  );

  const isActive = (href: string) => {
    if (!pathname || !href) return false;
    return pathname === href;
  };

  const canSee = (item: NavItem) =>
    (!item.allowedRoles || item.allowedRoles.some((r) => ctx.roles.includes(r))) &&
    (!item.visibleIf || item.visibleIf(ctx));

  const computeHref = (item: NavItem) => item.href ?? (item.buildHref ? item.buildHref(ctx) : '#');

  const builtMenu: NavGroup[] = React.useMemo(() => {
    return NAV_GROUPS.filter((g) => !g.visibleIf || g.visibleIf(ctx))
      .map((g) => ({
        ...g,
        items: g.items
          .filter((i) => canSee(i))
          .map(
            (i) =>
              ({
                ...i,
                href: computeHref(i),
                disabled: i.disabledIf ? i.disabledIf(ctx) : false,
              }) as NavItem & { disabled?: boolean },
          ),
      }))
      .filter((g) => g.items.length > 0);
  }, [ctx]);

  const toggle = () => setOpen((o) => !o);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
      {/* Top: Logo */}
      <Box sx={{ p: 2.5 }}>
        <Logo />
      </Box>
      <Divider sx={{ opacity: 0.1 }} />

      {/* Middle: Nav (grouped) */}
      <Box sx={{ px: 1, py: 1 }}>
        <Stack spacing={1.25}>
          {builtMenu.map((group, gi) => (
            <Box key={group.title}>
              <Typography
                variant="overline"
                sx={{
                  px: 1.25,
                  mb: 0.5,
                  display: 'block',
                  letterSpacing: 0.5,
                  color: alpha(theme.palette.text.secondary, 0.9),
                }}
              >
                {group.title}
              </Typography>
              <List sx={{ gap: 0.5, display: 'grid', mt: 0.5 }}>
                {group.items.map((item) => (
                  <ListItemButton
                    key={item.label}
                    onClick={() =>
                      !('disabled' in item && (item as any).disabled) &&
                      router.push(item.href as string)
                    }
                    selected={isActive(item.href as string)}
                    disabled={('disabled' in item && (item as any).disabled) as boolean}
                    sx={{
                      borderRadius: 1.5,
                      px: 1.25,
                      '&.Mui-selected': {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          theme.palette.mode === 'light' ? 0.12 : 0.22,
                        ),
                        color: theme.palette.primary.main,
                      },
                      '&:hover': {
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          theme.palette.mode === 'light' ? 0.08 : 0.16,
                        ),
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
              {gi < builtMenu.length - 1 && <Divider sx={{ my: 1.25, opacity: 0.12 }} />}
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Bottom: User bar */}
      <Box sx={{ p: 1.5, borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}` }}>
        <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
          <Stack direction="row" gap={1.25} alignItems="center">
            <Avatar sx={{ width: 36, height: 36 }}>{}</Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {user?.user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {roles?.[0]}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" gap={0.5} alignItems="center">
            <Tooltip title="Configuración">
              <IconButton size="small" href="/settings">
                <SettingsRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Salir">
              <IconButton size="small" onClick={() => router.push('/logout')}>
                {' '}
                {/* replace with real signOut */}
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      {/* AppBar for mobile to open drawer */}
      {!mdUp && (
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{
            backdropFilter: 'blur(8px)',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
            background: theme.palette.background.paper,
          }}
        >
          <Toolbar>
            <IconButton onClick={toggle} edge="start" sx={{ mr: 1 }}>
              <MenuRoundedIcon />
            </IconButton>
            <Logo />
          </Toolbar>
        </AppBar>
      )}

      {/* Left Drawer */}
      {mdUp ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            position: 'relative',
            zIndex: 101,
          }}
          PaperProps={{
            sx: {
              position: 'relative',
              width: DRAWER_WIDTH,
              height: '100vh',
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              backgroundColor: 'transparent',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={open}
          onClose={toggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              backgroundImage: 'none',
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* {
        mdUp && <DashboardHeader
          drawerSize={DRAWER_WIDTH}
          organizationName="Agora LATAM"
          events={mockEvents}
          activeEventId={activeEvent}
          onChangeEvent={setActiveEvent}
          onSettingsClick={() => alert("Abrir configuración")}
          user={{
            name: "Alejandro Gómez",
            avatarUrl:
              "https://res.cloudinary.com/dwcemtz63/image/upload/v1726317512/split_mate/profiles/ag_avatar.png",
          }}
        />
      } */}

      {/* Right panel */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          background: theme.palette.background.default,
        }}
      >
        {/* Spacer for mobile appbar */}
        {!mdUp && <Toolbar />}
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flex: 1, overflowY: 'scroll' }}>{children}</Box>
      </Box>
    </Box>
  );
};

// ------- Example pages using the layout -------
// App Router (recommended):
// File: app/(app)/layout.tsx
// ---------------------------------------------
// import type { Metadata } from "next";
// import { ProtectedLayout } from "./_components/AgoraLayout";
// export const metadata: Metadata = { title: "Agora — Panel" };
// export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
//   return <ProtectedLayout>{children}</ProtectedLayout>;
// }
//
// File: app/(app)/dashboard/page.tsx
// ---------------------------------------------
// export default function DashboardPage() {
//   return (
//     <>
//       <Typography variant="h4" fontWeight={900} gutterBottom>Dashboard</Typography>
//       <Typography color="text.secondary">Bienvenido al panel de Agora.</Typography>
//     </>
//   );
// }
//
// Pages Router alternative:
// Wrap each authenticated page with <ProtectedLayout> in _app.tsx or in the page component itself.
