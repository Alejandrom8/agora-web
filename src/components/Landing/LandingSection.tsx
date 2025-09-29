// Reusable Section wrapper with TS props
import { Box } from '@mui/material';
import React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

type SectionProps = {
  id?: string;
  sx?: SxProps<Theme>;
  children: React.ReactNode;
};

const LandingSection: React.FC<SectionProps> = ({ id, children, sx }) => (
  <Box id={id} component="section" sx={{ py: { xs: 8, md: 12 }, ...sx }}>
    {children}
  </Box>
);

export default LandingSection;
