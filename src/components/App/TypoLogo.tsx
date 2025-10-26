import { Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import * as React from 'react';

export default function TypoLogo({ ...props }) {
  const router = useRouter();
  const theme = useTheme();

  const handleLogoClick = () => {
    router.push('/');
  };

  // Usa el color primario del theme para el texto y filtra el logo según el modo
  const logoFilter = theme.palette.mode === 'light'
    ? 'invert(1) brightness(1.5)'
    : undefined;

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      spacing={1} {...props} 
      onClick={handleLogoClick}
      sx={{ cursor: 'pointer' }}
    >
      <img src={'/logo.svg'} style={{ width: '25px', height: '25px', filter: logoFilter }} />
      <Typography variant="h6" fontWeight={900} letterSpacing={0.2}>
        Agora
      </Typography>
    </Stack>
  );
}
