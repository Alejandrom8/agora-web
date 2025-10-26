import * as React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
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
  Container,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import NextLink from 'next/link';
import { useTheme, alpha } from '@mui/material/styles';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useRouter } from 'next/router';
import TypoLogo from '@/components/App/TypoLogo';
import { ThemeToggleSwitch } from '../Theme/ThemeToggleSwitch';

type NavItem = { label: string; href: string };
const NAV_ITEMS: NavItem[] = [
  { label: 'Eventos', href: '#funcionalidades' },
  { label: 'Hosts', href: '#para-admins' },
  { label: 'Precios', href: '#precios' },
  { label: 'Legal', href: '/legal' },
];


const REGION_FLAGS: Record<string, string> = {
  MX: '🇲🇽',
  USA: '🇺🇸',
};

export default function HorizontalNavbarFloating(): React.JSX.Element {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Cambia estilos al hacer scroll
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

  // Fondo y bordes con glassmorphism dependientes del tema
  const isLight = theme.palette.mode === 'light';
  const baseBg = isLight ? theme.palette.background.paper : theme.palette.background.default;
  const bg = alpha(baseBg, scrolled ? 0.85 : 0.65);
  const border = alpha(theme.palette.divider, scrolled ? 0.24 : 0.16);

  // Region selector
  const [region, setRegion] = React.useState<'MX' | 'ARG' | 'USA'>('MX');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openRegion = Boolean(anchorEl);
  const handleOpenRegion = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleCloseRegion = () => setAnchorEl(null);

  return (
    <>
      {/* Contenedor flotante con pill */}
  <Box sx={{ position: 'fixed', top: 20, left: 0, right: 0, zIndex: (t) => t.zIndex.appBar }}>
        <Container maxWidth="lg" disableGutters sx={{ px: { xs: 1.25, sm: 2, md: 0 } }}>
          <AppBar
            position="static"
            color="transparent"
            elevation={0}
            sx={{
              background: bg,
              border: `1px solid ${border}`,
              borderRadius: 999,
              boxShadow: `0 8px 30px ${alpha(theme.palette.common.black, isLight ? 0.10 : 0.35)}`,
              backdropFilter: 'saturate(140%) blur(10px)',
            }}
          >
            <Toolbar sx={{ 
              minHeight: { xs: 56, md: 64 }, px: { xs: 1, sm: 2.5, md: 3 }, 
              display: { xs: 'flex' }, 
              justifyContent: { xs: 'space-between'  },
              paddingX: { xs: 3 }
            }}>
              {/* Izquierda: Logo */}
              <TypoLogo sx={{ mr: 1 }} />

              {/* Centro: Links */}
              {mdUp && (
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{
                    ml: 2,
                    mr: 'auto',
                    alignItems: 'center',
                  }}
                >
                  {NAV_ITEMS.map((item) => (
                    <MLink
                      component={NextLink}
                      key={item.href}
                      href={item.href}
                      underline="none"
                      sx={{
                        position: 'relative',
                        color: theme.palette.text.primary,
                        fontWeight: 500,
                        py: 0.5,
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '100%',
                          transform: 'scaleX(0)',
                          height: '2px',
                          bottom: -4,
                          left: 0,
                          backgroundColor: theme.palette.primary.main,
                          transformOrigin: 'bottom right',
                          transition: 'transform 0.25s ease-out',
                        },
                        '&:hover': {
                          color: theme.palette.primary.main,
                          '&::after': { transform: 'scaleX(1)', transformOrigin: 'bottom left' },
                        },
                      }}
                    >
                      {item.label}
                    </MLink>
                  ))}
                </Stack>
              )}

              {/* Derecha: Region, Ingresar, CTA o Hamburguesa */}
              {mdUp ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => router.push('/login')}
                    sx={{ textTransform: 'none' }}
                  >
                    Ingresar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{ ml: 0.5 }}
                    onClick={() => router.push('/sign-up')}
                  >
                    Crear cuenta
                  </Button>
                  <Button
                    id="region-button"
                    aria-haspopup="true"
                    aria-controls={openRegion ? 'region-menu' : undefined}
                    aria-expanded={openRegion ? 'true' : undefined}
                    onClick={handleOpenRegion}
                    variant="outlined"
                    color="inherit"
                    sx={{
                      borderColor: alpha(theme.palette.text.primary, 0.2),
                      bgcolor: alpha(theme.palette.text.primary, 0.04),
                      textTransform: 'none',
                    }}
                  >
                    <Box component="span" sx={{ mr: 1 }}>{REGION_FLAGS[region]}</Box>
                    {region}
                  </Button>
                  <Menu
                    id="region-menu"
                    anchorEl={anchorEl}
                    open={openRegion}
                    onClose={handleCloseRegion}
                    MenuListProps={{ 'aria-labelledby': 'region-button' }}
                  >
                    {(['MX', 'USA'] as const).map((code) => (
                      <MenuItem
                        key={code}
                        selected={region === code}
                        onClick={() => {
                          setRegion(code);
                          handleCloseRegion();
                        }}
                      >
                        <Box component="span" sx={{ mr: 1 }}>{REGION_FLAGS[code]}</Box>
                        {code}
                      </MenuItem>
                    ))}
                  </Menu>
                  <ThemeToggleSwitch />
                </Stack>
              ) : (
                <IconButton edge="end" onClick={() => setOpen(true)} aria-label="Abrir menú">
                  <MenuRoundedIcon />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
        </Container>
      </Box>

      {/* Drawer mobile */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              width: 320,
              backgroundImage: 'none',
              backgroundColor: alpha(baseBg, 0.98),
              borderLeft: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              p: 1.5,
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            },
          }}
      >
        <TypoLogo sx={{ px: 1, pb: 1, pt: 3, pl: 2 }} />
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
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              router.push('/login');
              setOpen(false);
            }}
          >
            Ingresar
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => {
              router.push('/sign-up');
              setOpen(false);
            }}
          >
            Crear cuenta
          </Button>
          <Divider sx={{ my: 1, opacity: 0.12 }} />
          <Stack direction="row" spacing={1}>
            {(['MX', 'ARG', 'USA'] as const).map((code) => (
              <Chip
                key={code}
                label={`${REGION_FLAGS[code]} ${code}`}
                onClick={() => setRegion(code)}
                variant={region === code ? 'filled' : 'outlined'}
                sx={{ borderColor: alpha(theme.palette.text.primary, 0.2) }}
              />
            ))}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
