import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { agoraTheme } from '@/components/App/Theme';
import React from 'react';
import { agoraThemeLight } from '@/components/App/LightTheme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={agoraTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
