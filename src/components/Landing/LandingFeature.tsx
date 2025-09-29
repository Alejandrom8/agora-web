// Feature item
import { Box, Stack, Typography, alpha } from '@mui/material';
import React from 'react';

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const LandingFeature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start">
    <Box sx={{ p: 1, borderRadius: 2, backgroundColor: alpha('#FFFFFF', 0.06) }}>{icon}</Box>
    <Box>
      <Typography variant="h6" fontWeight={800} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Stack>
);

export default LandingFeature;
