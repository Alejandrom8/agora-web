import * as React from 'react';
import Image from 'next/image';
import { Box, Typography, useTheme } from '@mui/material';

interface EventCoverProps {
  coverImage?: string | null;
  eventName: string;
  height?: { xs: number; sm: number; md: number };
}

export function EventCover({ coverImage, eventName, height = { xs: 250, sm: 350, md: 450 } }: EventCoverProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {coverImage ? (
        <Image
          src={coverImage}
          alt={eventName}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h2" color="white" fontWeight={700}>
            {eventName}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

