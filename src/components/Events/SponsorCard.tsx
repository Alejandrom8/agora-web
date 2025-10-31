import * as React from 'react';
import Image from 'next/image';
import { Box, Typography, IconButton, alpha, useTheme } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { EventSponsor } from '@/lib/bff/types';

interface SponsorCardProps {
  sponsor: EventSponsor;
  colorIndex: number;
}

const SPONSOR_COLORS = [
  { bg: '#4285F4' }, // Google Blue
  { bg: '#FF9900' }, // Amazon Orange
  { bg: '#76B900' }, // NVIDIA Green
  { bg: '#E535AB' }, // Microsoft Purple
];

const TIER_LABELS: Record<string, string> = {
  platinum: 'Platino',
  gold: 'Oro',
  silver: 'Plata',
  bronze: 'Bronce',
};

export function SponsorCard({ sponsor, colorIndex }: SponsorCardProps) {
  const theme = useTheme();
  const colorConfig = SPONSOR_COLORS[colorIndex % SPONSOR_COLORS.length];

  return (
    <Box
      component="a"
      href={sponsor.website_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        position: 'relative',
        p: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Logo/Avatar */}
      {sponsor.logo_image ? (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            overflow: 'hidden',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Image
            src={sponsor.logo_image}
            alt={sponsor.name}
            width={40}
            height={40}
            style={{ objectFit: 'contain' }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1.5,
            bgcolor: colorConfig.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'white',
            fontSize: '1.25rem',
            fontWeight: 700,
          }}
        >
          {sponsor.name.charAt(0).toUpperCase()}
        </Box>
      )}

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: theme.palette.text.primary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.875rem',
          }}
        >
          {sponsor.name}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '0.75rem' }}
        >
          {sponsor.tier ? TIER_LABELS[sponsor.tier.toLowerCase()] || sponsor.tier : 'Patrocinador'}
        </Typography>
      </Box>

      {/* External Link Icon */}
      <IconButton
        size="small"
        sx={{
          color: 'text.secondary',
          p: 0.5,
          '&:hover': {
            color: theme.palette.primary.main,
            bgcolor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
      >
        <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
