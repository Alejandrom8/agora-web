// theme/agoraTheme.ts
import { createTheme, alpha } from '@mui/material/styles';

// Helpers
const bgBase = '#0F1216';
const surface = '#1E222A';
const primary = '#0057C9';
const secondary = '#343539';
const accent = '#0370FF';
const success = '#2ECC71';
const error = '#FF4D4F';
const warning = '#F5A524';

export const darkTheme = createTheme({
  cssVariables: true, // habilita vars CSS (MUI v5.14+)
  palette: {
    mode: 'dark',
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
    // Usamos "info" para el color de resaltado (accent)
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
      primary: '#E8EAED',
      secondary: '#B0B4BA',
      disabled: '#7C818A',
    },
    divider: alpha('#E8EAED', 0.08),
    success: {
      main: success,
      contrastText: '#0C1A12',
    },
    warning: {
      main: warning,
      contrastText: '#1A1206',
    },
    error: {
      main: error,
      contrastText: '#1A0E0E',
    },
    action: {
      hover: alpha('#FFFFFF', 0.06),
      selected: alpha('#FFFFFF', 0.1),
      disabled: alpha('#FFFFFF', 0.38),
      focus: alpha(accent, 0.24),
      active: '#FFFFFF',
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
    subtitle1: { fontWeight: 600, color: '#C9CED6' },
    subtitle2: { fontWeight: 600, color: '#A8AFBA' },
    body1: { fontSize: '1rem', lineHeight: 1.65 },
    body2: { fontSize: '0.925rem', lineHeight: 1.6, color: '#C0C5CF' },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0.2 },
    overline: { letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 },
    caption: { color: '#9AA1AC' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: `radial-gradient(1200px 800px at 80% -10%, ${alpha(accent, 0.06)} 0%, transparent 60%),
                            radial-gradient(1000px 600px at -10% 120%, ${alpha(primary, 0.05)} 0%, transparent 60%)`,
        },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: alpha('#FFFFFF', 0.18),
          borderRadius: 8,
          border: `2px solid ${bgBase}`,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha('#0B0D12', 0.7),
          backdropFilter: 'saturate(140%) blur(10px)',
          borderBottom: `1px solid ${alpha('#FFFFFF', 0.06)}`,
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
          border: `1px solid ${alpha('#FFFFFF', 0.06)}`,
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 16,
          //background: `linear-gradient(180deg, ${alpha('#FFFFFF', 0.04)}, ${alpha('#FFFFFF', 0)})`,
          //boxShadow: `0 10px 30px ${alpha('#000', 0.35)}`,
          backgroundColor: 'transparent',
          elevation: 0,
          boxShadow: 'none',
          backgroundImage: 'none',
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
          borderColor: alpha('#FFFFFF', 0.24),
          '&:hover': {
            borderColor: alpha('#FFFFFF', 0.4),
            backgroundColor: alpha('#FFFFFF', 0.04),
          },
        },
        text: {
          '&:hover': { backgroundColor: alpha(accent, 0.1) },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: alpha('#FFFFFF', 0.06),
          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        },
        colorPrimary: {
          backgroundColor: alpha(primary, 0.18),
          color: '#DDEBFF',
          borderColor: alpha(primary, 0.4),
        },
        colorSecondary: {
          backgroundColor: alpha(secondary, 0.18),
          color: '#E7E9ED',
          borderColor: alpha(secondary, 0.4),
        },
        colorSuccess: {
          backgroundColor: alpha(success, 0.06),
          color: success,
          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        },
        colorWarning: {
          backgroundColor: alpha(warning, 0.06),
          color: warning,
          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
        },
        colorError: {
          backgroundColor: alpha(error, 0.06),
          color: error,
          border: `1px solid ${alpha('#FFFFFF', 0.1)}`,
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
          backgroundColor: alpha('#FFFFFF', 0.02),
          borderRadius: 12,
          '& fieldset': { borderColor: alpha('#FFFFFF', 0.18) },
          '&:hover fieldset': { borderColor: alpha('#FFFFFF', 0.28) },
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
          color: alpha('#FFFFFF', 0.7),
          '&.Mui-selected': { color: '#FFFFFF' },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          border: `1px solid ${alpha('#FFFFFF', 0.08)}`,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0F1117',
          border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
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

  // Tokens personalizados para reusar en tu app
  // (accessibles vía theme.custom.*)
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
      subtle: `linear-gradient(180deg, ${alpha('#FFFFFF', 0.03)}, ${alpha('#FFFFFF', 0)})`,
    },
    shadow: {
      lg: `0 10px 30px ${alpha('#000', 0.35)}`,
      md: `0 6px 18px ${alpha('#000', 0.28)}`,
    },
    badge: {
      // útil para “Founder / Investor / Technologist”
      founder: { bg: alpha(primary, 0.2), color: '#DDEBFF', border: alpha(primary, 0.5) },
      investor: { bg: alpha('#2ECC71', 0.18), color: '#DFF7EA', border: alpha('#2ECC71', 0.45) },
      technologist: { bg: alpha(accent, 0.2), color: '#E2ECFF', border: alpha(accent, 0.5) },
    },
  },
});

// Tipado opcional para acceder a theme.custom sin "any":
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
