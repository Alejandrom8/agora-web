// theme/agoraTheme.light.ts
import { createTheme, alpha } from '@mui/material/styles';

// Helpers (light)
const bgBase = '#F6F8FB';
const surface = '#FFFFFF';
const primary = '#0057C9';
const secondary = '#343539'; // lo mantenemos para chips/contrastes puntuales en light
const accent = '#0370FF';

export const lightTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: primary,
      dark: '#0047A3',
      light: '#3B86FF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: secondary,
      light: '#4B4D52',
      dark: '#26272B',
      contrastText: '#FFFFFF',
    },
    info: {
      main: accent,
      light: '#3A8AFF',
      dark: '#025ACC',
      contrastText: '#FFFFFF',
    },
    background: {
      default: bgBase,
      paper: surface,
    },
    text: {
      primary: '#111418',
      secondary: '#4A4F57',
      disabled: '#8C929C',
    },
    divider: alpha('#0B0D12', 0.1),
    success: {
      main: '#2ECC71',
      contrastText: '#0C1A12',
    },
    warning: {
      main: '#F5A524',
      contrastText: '#1A1206',
    },
    error: {
      main: '#E03636',
      contrastText: '#1A0E0E',
    },
    action: {
      hover: alpha('#000000', 0.04),
      selected: alpha('#000000', 0.06),
      disabled: alpha('#000000', 0.26),
      focus: alpha(accent, 0.18),
      active: '#111418',
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: [
      'Inter',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'Apple Color Emoji',
      'Segoe UI Emoji',
    ].join(','),
    h1: { fontWeight: 800, fontSize: '3rem', lineHeight: 1.1, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, fontSize: '2.25rem', lineHeight: 1.15, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.2 },
    h4: { fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.25 },
    h5: { fontWeight: 700, fontSize: '1.25rem' },
    h6: { fontWeight: 700, fontSize: '1.125rem' },
    subtitle1: { fontWeight: 600, color: '#2C3138' },
    subtitle2: { fontWeight: 600, color: '#5A606A' },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.925rem', lineHeight: 1.6, color: '#4F5560' },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0.2 },
    overline: { letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 },
    caption: { color: '#6C7380' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `
            radial-gradient(1200px 800px at 80% -10%, ${alpha(accent, 0.08)} 0%, transparent 60%),
            radial-gradient(1000px 600px at -10% 120%, ${alpha(primary, 0.07)} 0%, transparent 60%)
          `,
        },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#000000', 0.22),
          borderRadius: 8,
          border: `2px solid ${bgBase}`,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha('#FFFFFF', 0.7),
          backdropFilter: 'saturate(140%) blur(10px)',
          borderBottom: `1px solid ${alpha('#000000', 0.06)}`,
        },
      },
    },

    MuiContainer: {
      defaultProps: { maxWidth: 'lg' },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: surface,
          border: `1px solid ${alpha('#000000', 0.06)}`,
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: `linear-gradient(180deg, ${alpha('#000000', 0.02)}, ${alpha('#000000', 0)})`,
          boxShadow: `0 10px 30px ${alpha('#000', 0.12)}`,
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 16,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${primary}, ${accent})`,
        },
        outlined: {
          borderColor: alpha('#000000', 0.14),
          '&:hover': {
            borderColor: alpha('#000000', 0.28),
            backgroundColor: alpha('#000000', 0.04),
          },
        },
        text: {
          '&:hover': { backgroundColor: alpha(accent, 0.08) },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: alpha('#000000', 0.04),
          border: `1px solid ${alpha('#000000', 0.1)}`,
        },
        colorPrimary: {
          backgroundColor: alpha(primary, 0.14),
          color: '#0A2B66',
          borderColor: alpha(primary, 0.35),
        },
        colorSecondary: {
          backgroundColor: alpha(secondary, 0.12),
          color: '#1C1D22',
          borderColor: alpha(secondary, 0.3),
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#000000', 0.02),
          borderRadius: 12,
          '& fieldset': { borderColor: alpha('#000000', 0.18) },
          '&:hover fieldset': { borderColor: alpha('#000000', 0.28) },
          '&.Mui-focused fieldset': { borderColor: accent },
        },
        input: {
          '::placeholder': { opacity: 0.6 },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${primary}, ${accent})`,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          color: alpha('#000000', 0.6),
          '&.Mui-selected': { color: '#111418' },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: `1px solid ${alpha('#000000', 0.08)}`,
          background: `linear-gradient(180deg, ${alpha('#000000', 0.02)}, ${alpha('#000000', 0)})`,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#FFFFFF',
          color: '#111418',
          border: `1px solid ${alpha('#000000', 0.12)}`,
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: accent,
          fontWeight: 600,
          textUnderlineOffset: 4,
          '&:hover': { color: '#3A8AFF' },
        },
      },
    },
  },

  // Tokens personalizados (mismo shape que el tema dark)
  custom: {
    brand: {
      primary,
      secondary,
      accent,
      bg: bgBase,
      surface,
    },
    gradient: {
      primary: `linear-gradient(135deg, ${primary}, ${accent})`,
      subtle: `linear-gradient(180deg, ${alpha('#000000', 0.02)}, ${alpha('#000000', 0)})`,
    },
    shadow: {
      lg: `0 10px 30px ${alpha('#000', 0.12)}`,
      md: `0 6px 18px ${alpha('#000', 0.1)}`,
    },
    badge: {
      founder: { bg: alpha(primary, 0.12), color: '#0A2B66', border: alpha(primary, 0.35) },
      investor: { bg: alpha('#2ECC71', 0.14), color: '#0D3A24', border: alpha('#2ECC71', 0.45) },
      technologist: { bg: alpha(accent, 0.12), color: '#0A2B66', border: alpha(accent, 0.4) },
    },
  },
});

// Tipado para theme.custom (igual al tema dark)
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      brand: { primary: string; secondary: string; accent: string; bg: string; surface: string };
      gradient: { primary: string; subtle: string };
      shadow: { lg: string; md: string };
      badge: {
        founder: { bg: string; color: string; border: string };
        investor: { bg: string; color: string; border: string };
        technologist: { bg: string; color: string; border: string };
      };
    };
  }
  interface ThemeOptions {
    custom?: Theme['custom'];
  }
}
