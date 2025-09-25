import * as React from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Stack,
    Box,
    Link as MLink,
    Button,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    useScrollTrigger,
    useMediaQuery,
    Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

type NavItem = { label: string; href: string };
const NAV_ITEMS: NavItem[] = [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Para Admins", href: "#para-admins" },
    { label: "Precios", href: "#precios" },
];

const primary = "#0057C9";
const accent  = "#0370FF";

export default function HorizontalNavbarFloating(): React.JSX.Element {
    const theme = useTheme();
    const mdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [open, setOpen] = React.useState(false);

    // Cambia estilos al hacer scroll
    const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

    const bg = scrolled ? alpha("#0B0D12", 0.1) : alpha("#0B0D12", 0);
    const border = alpha("#FFFFFF", scrolled ? 0.12 : 0.08);

    return (
        <>
            {/* Spacer para que el contenido no quede debajo del navbar fijo */}
            <Box sx={{ height: 64 }} />

            {/* Contenedor flotante (márgenes y anchura) */}
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: (t) => t.zIndex.appBar,
                }}
            >
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{
                        background: bg,
                        border: 0,
                        backdropFilter: "saturate(140%) blur(10px)",
                        //border: `1px solid ${border}`,
                        borderRadius: 0,            // esquinas redondeadas
                        //boxShadow: `0 10px 30px ${alpha("#000", 0.35)}`,
                    }}
                >
                    <Toolbar sx={{ gap: 2, minHeight: 64, px: { xs: 2, sm: 3 } }}>
                        {/* Izquierda: Logo */}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                            <Box
                                sx={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${primary}, ${accent})`,
                                }}
                            />
                            <Typography variant="h6" fontWeight={900} letterSpacing={0.2}>
                                Agora
                            </Typography>
                        </Stack>

                        {/* Desktop: links + CTAs */}
                        {mdUp ? (
                            <>
                                {NAV_ITEMS.map((item) => (
                                    <MLink key={item.href} href={item.href} underline="none" sx={{ mr: 1 }}>
                                        {item.label}
                                    </MLink>
                                ))}
                                <Button variant="text" color="inherit" href="/login">
                                    Ingresar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    href="/sign-up"
                                    endIcon={<ArrowForwardRoundedIcon />}
                                    sx={{ ml: 1 }}
                                >
                                    Crear cuenta
                                </Button>
                            </>
                        ) : (
                            // Mobile: botón hamburguesa
                            <IconButton edge="end" onClick={() => setOpen(true)} aria-label="Abrir menú">
                                <MenuRoundedIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>

            {/* Drawer mobile */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: 300,
                        backgroundImage: "none",
                        borderLeft: `1px solid ${alpha("#FFFFFF", 0.08)}`,
                        p: 1.5,
                    },
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, pb: 1 }}>
                    <Box
                        sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 2,
                            background: `linear-gradient(135deg, ${primary}, ${accent})`,
                        }}
                    />
                    <Typography fontWeight={800}>Agora</Typography>
                </Stack>
                <Divider sx={{ mb: 1, opacity: 0.2 }} />
                <List>
                    {NAV_ITEMS.map((item) => (
                        <ListItemButton
                            key={item.href}
                            component="a"
                            href={item.href}
                            onClick={() => setOpen(false)}
                        >
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
                </List>
                <Divider sx={{ my: 1, opacity: 0.2 }} />
                <Stack spacing={1} sx={{ px: 1 }}>
                    <Button variant="outlined" color="inherit" href="/login" onClick={() => setOpen(false)}>
                        Ingresar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/sign-up"
                        endIcon={<ArrowForwardRoundedIcon />}
                        onClick={() => setOpen(false)}
                    >
                        Crear cuenta
                    </Button>
                </Stack>
            </Drawer>
        </>
    );
}