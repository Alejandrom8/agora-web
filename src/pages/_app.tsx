import React from 'react';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { agoraTheme } from '@/components/App/Theme';
import { bffClient } from '@/lib/clients/bff';
import { SnackbarProvider } from 'notistack';

const swrFetcher = (endpoint: string) => bffClient.get(endpoint); // e.g. '/api/auth/me'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={agoraTheme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <SWRConfig value={{
          fetcher: swrFetcher,
          dedupingInterval: 1000,
          revalidateOnFocus: false,
          shouldRetryOnError: false,
        }}>
          <Component {...pageProps} />
        </SWRConfig>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
