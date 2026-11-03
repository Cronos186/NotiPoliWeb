import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { MARCA } from '@/constants';

/* ============================================================
   NotiPoliWeb — Sección de página
   Reemplaza a `.section` / `.section--gray` del CSS original.
   ============================================================ */

interface SeccionProps {
  children: ReactNode;
  titulo?: string;
  subtitulo?: string;
  /** Fondo gris alternado usado en las secciones pares. */
  fondoGris?: boolean;
  centrado?: boolean;
  /** Máximo ancho del contenido. */
  ancho?: 'md' | 'lg' | 'xl';
  /**
   * Nivel semántico del título. Usa `h1` cuando la sección sea el
   * encabezado principal de la página; `h2` (por defecto) cuando sea
   * una sección dentro de una página que ya tiene su propio `h1`.
   */
  nivelTitulo?: 'h1' | 'h2';
  /** Línea horizontal bajo el título, como en los wireframes. */
  divisor?: boolean;
}

export default function Seccion({
  children,
  titulo,
  subtitulo,
  fondoGris = false,
  centrado = false,
  ancho = 'lg',
  nivelTitulo = 'h2',
  divisor = false,
}: SeccionProps) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: fondoGris ? MARCA.grisFondo : 'transparent',
        py: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth={ancho} sx={{ px: { xs: 2, md: 3 } }}>
        {titulo && (
          <Typography
            variant="h2"
            component={nivelTitulo}
            sx={{
              color: 'primary.main',
              mb: subtitulo ? 1 : 4,
              textAlign: centrado ? 'center' : 'left',
            }}
          >
            {titulo}
          </Typography>
        )}

        {subtitulo && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: centrado ? 'center' : 'left' }}
          >
            {subtitulo}
          </Typography>
        )}

        {titulo && divisor && (
          <Divider sx={{ mb: 4, mt: subtitulo ? -3 : -2, borderColor: '#D1D5DB' }} />
        )}

        {children}
      </Container>
    </Box>
  );
}
