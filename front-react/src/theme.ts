import { createTheme } from '@mui/material/styles';
import { MARCA } from '@/constants';

/* ============================================================
   NotiPoliWeb — Theme de Material UI
   Traduce la identidad visual de la hoja de estilos original
   (azul #1E3A8A, ámbar #F59E0B, tipografía Poppins) al theme.
   ============================================================ */

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: MARCA.azul,
      light: MARCA.azulClaro,
      dark: MARCA.azulOscuro,
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: MARCA.ambar,
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#111827',
    },
    error: { main: '#DC2626' },
    success: { main: '#059669' },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: MARCA.texto,
      secondary: MARCA.textoSuave,
    },
    divider: '#E5E7EB',
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: '"Poppins", Arial, sans-serif',
    h1: { fontSize: '2.625rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', fontWeight: 700 },
    h4: { fontSize: '1.125rem', fontWeight: 700 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem' },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F9FAFB' },
        a: { textDecoration: 'none', color: 'inherit' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 20,
          paddingBlock: 10,
          '&:hover': { transform: 'translateY(-2px)' },
          transition: 'transform .15s ease, box-shadow .15s ease',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,.08)',
          transition: 'transform .2s ease, box-shadow .2s ease',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700, letterSpacing: '.5px' },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, variant: 'outlined' },
    },
    MuiContainer: {
      styleOverrides: {
        root: { paddingInline: 0 },
      },
    },
  },
});

/** Estilos compartidos para el chip de categoría. */
export const chipCategoriaSx = {
  bgcolor: '#E0E7FF',
  color: MARCA.azul,
  fontSize: '0.6875rem',
  height: 22,
  textTransform: 'uppercase' as const,
  alignSelf: 'flex-start',
};

/** Fondo degradado del hero, tomado de `.hero` en styles.css. */
export const heroGradientSx = {
  background: `linear-gradient(135deg, ${MARCA.azul}, ${MARCA.azulClaro})`,
  color: '#FFFFFF',
  textAlign: 'center' as const,
  px: { xs: 3, md: 5 },
  py: { xs: 6, md: 10 },
};
