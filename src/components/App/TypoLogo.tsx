import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';

export default function TypoLogo({ ...props }) {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={1} {...props} 
      onClick={handleLogoClick}
      sx={{ cursor: 'pointer' }}
    >
      <img src={'/logo.svg'} style={{ width: '25px', height: '25px' }} />
      <Typography variant="h6" fontWeight={900} letterSpacing={0.2}>
        Agora
      </Typography>
    </Stack>
  );
}
