import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import TypoLogo from '@/components/App/TypoLogo';
import { useRouter } from 'next/router';

/**
 * LoggedInNavBar — Agora style navbar for authenticated users
 * Visual reference: Airbnb top bar (pill search + avatar window-menu)
 * Design language: Agora (soft glass, elevated papers, rounded 16/24, subtle gradient, brand accents)
 */

export type LoggedInNavBarProps = {
  user: {
    name: string;
    avatarUrl?: string;
    organization?: string;
  };
  onCreateEvent?: () => void;
  onGoHome?: () => void;
  onOpenSearch?: () => void;
  onLogout?: () => void;
};

export default function LoggedInNavBar({
  user,
  onCreateEvent,
}: LoggedInNavBarProps) {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [notifEl, setNotifEl] = React.useState<HTMLElement | null>(null);

  const openUser = Boolean(anchorEl);
  const openNotif = Boolean(notifEl);

  const handleUserOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleUserClose = () => setAnchorEl(null);
  const handleNotifOpen = (e: React.MouseEvent<HTMLElement>) => setNotifEl(e.currentTarget);
  const handleNotifClose = () => setNotifEl(null);

  // Brand tokens (adjust to Agora theme if available)
  const AGORA_ACCENT = theme.palette.primary.main; // brand accent
  const AGORA_BG = theme.palette.mode === 'dark' ? alpha('#0B1020', 0.6) : alpha('#FFFFFF', 0.6);

  const onLogout = () => {
    router.push('/logout');
  };

  return (
    <AppBar
      elevation={0}
      position="static"
      color="transparent"
      sx={{
        backgroundColor: 'transparent',
        borderBottom: 0,
        filter: 'none',
        backdropFilter: 'none',
      }}
    >
      <Toolbar
        sx={{
          py: 4,
          gap: 1.5,
          minHeight: 72,
          display: 'grid',
          gridTemplateColumns: isSm ? '1fr auto' : '200px 1fr auto',
          px: { md: 22, xs: 2 },
        }}
      >
        {/* Left: Logo */}
        <TypoLogo />

        {/* Middle: Pill Search (Airbnb-like) */}
        {/*<Paper*/}
        {/*  elevation={0}*/}
        {/*  onClick={onOpenSearch}*/}
        {/*  sx={{*/}
        {/*    mx: 'auto',*/}
        {/*    display: 'grid',*/}
        {/*    gridAutoFlow: 'column',*/}
        {/*    gridTemplateColumns: isSm ? '1fr auto' : '160px 1fr 140px auto',*/}
        {/*    alignItems: 'center',*/}
        {/*    gap: 0.5,*/}
        {/*    px: 1,*/}
        {/*    py: 0.5,*/}
        {/*    borderRadius: 999,*/}
        {/*    cursor: 'pointer',*/}
        {/*    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,*/}
        {/*    backgroundColor: AGORA_BG,*/}
        {/*    boxShadow: `0 1px 0 ${alpha(theme.palette.common.black, 0.05)}`,*/}
        {/*    transition: 'box-shadow .2s ease, transform .12s ease',*/}
        {/*    '&:hover': {*/}
        {/*      boxShadow: theme.shadows[6],*/}
        {/*    },*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {!isSm && <FieldChip label="Destino" value="Buscar destinos" />}*/}
        {/*  {!isSm && <FieldChip label="Fechas" value="Agregar fechas" />}*/}
        {/*  <FieldChip label="Huéspedes" value="¿Cuántos?" />*/}

        {/*  <IconButton*/}
        {/*    size="small"*/}
        {/*    sx={{*/}
        {/*      bgcolor: AGORA_ACCENT,*/}
        {/*      color: '#fff',*/}
        {/*      ml: 0.5,*/}
        {/*      '&:hover': { bgcolor: alpha(AGORA_ACCENT, 0.9) },*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <SearchRoundedIcon />*/}
        {/*  </IconButton>*/}
        {/*</Paper>*/}

        {/* Right: CTAs + Avatar */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-end">
          {!isSm && (
            <Tooltip title="Crear evento">
              <Button
                onClick={onCreateEvent}
                startIcon={<AddRoundedIcon />}
                variant="text"
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 1.25,
                  color: theme.palette.text.primary,
                  '&:hover': { backgroundColor: alpha(AGORA_ACCENT, 0.08) },
                }}
              >
                Crear evento
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Notificaciones">
            <IconButton
              size="small"
              onClick={handleNotifOpen}
              sx={{ color: theme.palette.text.secondary }}
            >
              <Badge color="error" variant="dot">
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              pl: 1,
              pr: 0.5,
              py: 0.25,
              borderRadius: 999,
              border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              backgroundColor: AGORA_BG,
              cursor: 'pointer',
            }}
            onClick={handleUserOpen}
          >
            <KeyboardArrowDownRoundedIcon fontSize="small" />
            <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
          </Paper>
        </Stack>

        {/* Notifications popover (window style) */}
        <Popover
          open={openNotif}
          onClose={handleNotifClose}
          anchorEl={notifEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 1.5, minWidth: 320 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
              Notificaciones
            </Typography>
            <EmptyState
              title="Estás al día"
              description="Te avisaremos cuando haya novedades de tus eventos."
            />
          </Box>
        </Popover>

        {/* User popover (window style) */}
        <Popover
          open={openUser}
          onClose={handleUserClose}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 1.25, minWidth: 320 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5, pb: 1 }}>
              <Avatar alt={user.name} src={user.avatarUrl} />
              <Box>
                <Typography fontWeight={700}>{user.name}</Typography>
                {!!user.organization && (
                  <Typography variant="caption" color="text.secondary">
                    {user.organization}
                  </Typography>
                )}
              </Box>
            </Stack>

            <MenuList dense>
              <MenuItem>
                <ListItemIcon>
                  <AccountCircleRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mi perfil" />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <EventAvailableRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Mis eventos" />
                <KeyboardArrowRightRoundedIcon fontSize="small" />
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <GroupsRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Organización" />
              </MenuItem>
            </MenuList>

            <Divider sx={{ my: 1 }} />

            <MenuList dense>
              <MenuItem>
                <ListItemIcon>
                  <SettingsRoundedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Configuración" />
              </MenuItem>
              <MenuItem onClick={onLogout} sx={{ color: theme.palette.error.main }}>
                <ListItemIcon>
                  <LogoutRoundedIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Cerrar sesión" />
              </MenuItem>
            </MenuList>
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        textAlign: 'center',
        borderColor: alpha(theme.palette.divider, 0.6),
      }}
    >
      <Typography fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {description}
      </Typography>
    </Paper>
  );
}
