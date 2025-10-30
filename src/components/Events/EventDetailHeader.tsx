import * as React from 'react';
import { Box, Typography, Stack, Chip, Button, IconButton, alpha, useTheme } from '@mui/material';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

interface EventDetailHeaderProps {
  title: string;
  formattedDate: string;
  formattedTime: string;
  location: string;
  isPublic: boolean;
  onRegister?: () => void;
  onAddToCalendar?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
  onLocationClick?: () => void;
}

export function EventDetailHeader({
  title,
  formattedDate,
  formattedTime,
  location,
  isPublic,
  onRegister,
  onAddToCalendar,
  onShare,
  onFavorite,
  onLocationClick,
}: EventDetailHeaderProps) {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formattedDate}, {formattedTime}
          </Typography>
        </Stack>

        <Chip
          label={isPublic ? 'Público' : 'Privado'}
          size="small"
          icon={isPublic ? <PublicRoundedIcon /> : <LockRoundedIcon />}
          sx={{
            height: 24,
            fontSize: '0.75rem',
            bgcolor: isPublic
              ? alpha(theme.palette.success.main, 0.1)
              : alpha(theme.palette.warning.main, 0.1),
            color: isPublic ? theme.palette.success.main : theme.palette.warning.main,
            '& .MuiChip-icon': {
              ml: 1,
              fontSize: 16,
            },
          }}
        />
      </Stack>

      <Stack
        direction="row"
        spacing={0.5}
        alignItems="center"
        onClick={onLocationClick}
        sx={{
          mb: 3,
          cursor: 'pointer',
          width: 'fit-content',
          '&:hover .location-text': {
            color: theme.palette.primary.main,
          },
          '&:hover .location-icon': {
            color: theme.palette.primary.main,
          },
        }}
      >
        <LocationOnRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography
          variant="body2"
          color="text.secondary"
          className="location-text"
          sx={{
            transition: 'color 0.2s',
          }}
        >
          {location}
        </Typography>
        <OpenInNewRoundedIcon
          className="location-icon"
          sx={{
            fontSize: 14,
            color: 'text.secondary',
            transition: 'color 0.2s',
          }}
        />
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<EventAvailableRoundedIcon />}
          onClick={onRegister}
          sx={{
            py: 1,
            px: 3,
            fontSize: '0.875rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1.5,
          }}
        >
          Registrarme
        </Button>
        <Button
          variant="outlined"
          onClick={onAddToCalendar}
          sx={{
            py: 1,
            px: 2.5,
            fontSize: '0.875rem',
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 1.5,
          }}
        >
          Añadir al calendario
        </Button>
        <IconButton
          onClick={onShare}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
          }}
        >
          <ShareRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton
          onClick={onFavorite}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
          }}
        >
          <FavoriteBorderRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Box>
  );
}
