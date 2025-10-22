import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
} from '@mui/material';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// 🧠 Tipos de datos
interface EventOption {
  id: string;
  name: string;
}

interface UserInfo {
  name: string;
  avatarUrl?: string;
}

interface DashboardHeaderProps {
  drawerSize: number;
  logoUrl?: string;
  organizationName: string;
  events: EventOption[];
  activeEventId?: string;
  onChangeEvent: (eventId: string) => void;
  user: UserInfo;
  onSettingsClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  drawerSize,
  events,
  activeEventId,
  onChangeEvent,
  user,
  onSettingsClick,
}) => {
  const handleEventChange = (e: SelectChangeEvent<string>) => {
    onChangeEvent(e.target.value as string);
  };

  return (
    <AppBar
      color="transparent"
      position="sticky"
      elevation={0}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        border: 0,
        color: 'white',
        zIndex: 10,
        backgroundColor: 'transparent',
        backdropFilter: 'none',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 64,
          px: { xs: 2, sm: 3, md: 2 },
          ml: { md: `${drawerSize}px` },
        }}
      >
        {/* 🔹 Izquierda: Logo + Organización + Selector de evento */}
        <Box display="flex" alignItems="center" gap={3}>
          {/* Nombre de organización */}
          {/* <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#fff", opacity: 0.9 }}
          >
            {organizationName}
          </Typography> */}

          {/* Selector de evento */}
          <FormControl
            variant="standard"
            sx={{
              minWidth: 200,
              '& .MuiSelect-icon': { color: 'white' },
              '& .MuiInputBase-root': {
                color: 'white',
                fontWeight: 500,
              },
            }}
          >
            <Select
              value={activeEventId || ''}
              onChange={handleEventChange}
              disableUnderline
              IconComponent={ArrowDropDownIcon}
            >
              {events.map((evt) => (
                <MenuItem key={evt.id} value={evt.id}>
                  {evt.name}
                </MenuItem>
              ))}
              {events.length === 0 && <MenuItem disabled>No hay eventos</MenuItem>}
            </Select>
          </FormControl>
        </Box>

        {/* 🔹 Derecha: Configuración + Avatar */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton
            onClick={onSettingsClick}
            color="inherit"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            <SettingsRoundedIcon />
          </IconButton>

          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{
              width: 40,
              height: 40,
              border: '2px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
