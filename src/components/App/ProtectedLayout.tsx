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

import * as React from "react";
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
    Button,
} from "@mui/material";
import { alpha, useTheme, type Theme } from "@mui/material/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {useRouter} from "next/navigation";

// ------- Mock auth hook (replace with NextAuth or your auth) -------
// Example with NextAuth:
// import { useSession, signOut } from "next-auth/react";
// const useAuth = () => {
//   const { data, status } = useSession();
//   return { user: data?.user ?? null, loading: status === "loading", signOut };
// };

const useAuth = () => {
    // Demo user; change to real auth
    const [loading] = React.useState(false);
    const user = { name: "Alejandro Gómez", email: "alex@example.com" };
    const signOut = () => console.log("signOut()");
    return { user, loading, signOut };
};

// ------- Layout constants -------
const DRAWER_WIDTH = 280;

// ------- Nav config -------
interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", href: "/manage", icon: <DashboardRoundedIcon /> },
    { label: "Eventos", href: "/manage/events", icon: <EventRoundedIcon /> },
    { label: "Asistentes", href: "/manage/attendees", icon: <PeopleAltRoundedIcon /> },
    { label: "Análisis", href: "/manage/analytics", icon: <InsightsRoundedIcon /> },
];

// Util logo
const Logo: React.FC = () => (
    <Stack direction="row" spacing={1} alignItems="center">
        <img src={'/logo.svg'} style={{ width: '22px', height: '22px' }}/>
        <Typography variant="h6" fontWeight={900}>Agora</Typography>
    </Stack>
);

// ------- ProtectedLayout --------
// Renders children only if the user is authenticated; otherwise show a sign-in CTA or redirect.
export const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
                <Typography color="text.secondary">Cargando…</Typography>
            </Box>
        );
    }
    if (!user) {
        // App Router: you might redirect in a server component or middleware instead.
        return (
            <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", textAlign: "center", p: 3 }}>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                    Debes iniciar sesión
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Inicia sesión para acceder al panel de administración de Agora.
                </Typography>
                <Button href="/login" variant="contained">Ir a Ingresar</Button>
            </Box>
        );
    }

    return <AppLayout>{children}</AppLayout>;
};

// ------- AppLayout --------
export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const theme = useTheme();
    const mdUp = useMediaQuery((t: Theme) => t.breakpoints.up("md"));
    const [open, setOpen] = React.useState(false);

    const toggle = () => setOpen((o) => !o);

    const drawerContent = (
        <Box sx={{ height: "100%", display: "grid", gridTemplateRows: "auto 1fr auto" }}>
            {/* Top: Logo */}
            <Box sx={{ p: 2.5 }}>
                <Logo />
            </Box>
            <Divider sx={{ opacity: 0.1 }} />

            {/* Middle: Nav */}
            <Box sx={{ px: 1, py: 1 }}>
                <List sx={{ gap: 0.5, display: "grid" }}>
                    {NAV_ITEMS.map((item) => (
                        <ListItemButton
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            sx={{
                                borderRadius: 1.5,
                                px: 1.25,
                                '&.active, &:hover': { backgroundColor: alpha(theme.palette.info.main, 0.12) },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Box>

            {/* Bottom: User bar */}
            <Box sx={{ p: 1.5, borderTop: `1px solid ${alpha("#FFFFFF", 0.08)}` }}>
                <Stack direction="row" gap={1} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" gap={1.25} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36 }}>AG</Avatar>
                        <Box>
                            <Typography variant="body2" fontWeight={700}>Carolina Arango</Typography>
                            <Typography variant="caption" color="text.secondary">Admin</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" gap={0.5} alignItems="center">
                        <Tooltip title="Configuración">
                            <IconButton size="small" href="/settings">
                                <SettingsRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Salir">
                            <IconButton size="small" onClick={() => console.log("signOut()")}> {/* replace with real signOut */}
                                <LogoutRoundedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
            {/* AppBar for mobile to open drawer */}
            {!mdUp && (
                <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: "blur(8px)", borderBottom: `1px solid ${alpha("#FFFFFF", 0.08)}` }}>
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
                    PaperProps={{
                        sx: {
                            position: "relative",
                            width: DRAWER_WIDTH,
                            height: '100vh',
                            borderRight: `1px solid ${alpha("#FFFFFF", 0.08)}`,
                            backgroundImage: "none",
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
                            borderRight: `1px solid ${alpha("#FFFFFF", 0.08)}`,
                            backgroundImage: "none",
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {/* Right panel */}
            <Box component="main" sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: '100vh', overflow: 'hidden' }}>
                {/* Spacer for mobile appbar */}
                {!mdUp && <Toolbar />}
                <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flex: 1, overflowY: 'scroll' }}>
                    {children}
                </Box>
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
