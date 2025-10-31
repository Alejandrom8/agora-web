import React from 'react';
import { SWRConfig } from 'swr';
import type { AppProps } from 'next/app';
import { CssBaseline, GlobalStyles } from '@mui/material';
import { bffClient } from '@/lib/clients/bff';
import { SnackbarProvider } from 'notistack';
import { AppThemeProvider } from '@/components/Theme/ThemeProvider';
import ProgressBar from '@/components/App/ProgressBar';

const swrFetcher = (endpoint: string) => bffClient.get(endpoint); // e.g. '/api/auth/me'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppThemeProvider>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <SWRConfig value={{
          fetcher: swrFetcher,
          dedupingInterval: 1000,
          revalidateOnFocus: false,
          shouldRetryOnError: false,
        }}>
          <GlobalStyles styles={(theme) => ({
            "#nprogress": { pointerEvents: "none" },
            "#nprogress .bar": {
              background: theme.palette.primary.main,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: 3,
              zIndex: 2000,
            },
            "#nprogress .peg": {
              boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
              opacity: 1,
            },
            "#nprogress .spinner": { display: "none" },
          })} />
          <ProgressBar />
          <Component {...pageProps} />
        </SWRConfig>
      </SnackbarProvider>
    </AppThemeProvider>
  );
}
