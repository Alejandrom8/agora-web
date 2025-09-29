import { Stack, Typography } from '@mui/material';
import * as React from 'react';

export default function TypoLogo({ ...props }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} {...props}>
      <img src={'/logo.svg'} style={{ width: '25px', height: '25px' }} />
      <Typography variant="h6" fontWeight={900} letterSpacing={0.2}>
        Agora
      </Typography>
    </Stack>
  );
}
