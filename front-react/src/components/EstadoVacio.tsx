import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

/* ============================================================
   NotiPoliWeb — Estado vacío reutilizable
   ============================================================ */

interface EstadoVacioProps {
  /** Icono de Material UI que ilustra el estado. */
  icono?: ReactNode;
  titulo: string;
  texto?: string;
  accion?: ReactNode;
  sx?: SxProps<Theme>;
  /**
   * Nivel semántico del título. Usa `h1` cuando el estado vacío sea el
   * contenido principal de la página (por ejemplo, un 404).
   */
  nivelTitulo?: 'h1' | 'h2';
}

export default function EstadoVacio({
  icono,
  titulo,
  texto,
  accion,
  sx,
  nivelTitulo = 'h2',
}: EstadoVacioProps) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        ...sx,
      }}
    >
      {icono && (
        <Box
          aria-hidden
          sx={{
            display: 'flex',
            justifyContent: 'center',
            color: 'primary.main',
            mb: 2,
            '& svg': { fontSize: '3.5rem' },
          }}
        >
          {icono}
        </Box>
      )}

      <Typography variant="h3" component={nivelTitulo} sx={{ color: 'primary.main', mb: 1 }}>
        {titulo}
      </Typography>

      {texto && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, mx: 'auto', mb: accion ? 3 : 0 }}
        >
          {texto}
        </Typography>
      )}

      {accion}
    </Box>
  );
}

/** Acción estándar de los estados vacíos. */
export function AccionVacio({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Button variant="contained" color="primary" onClick={onClick} size="large">
      {children}
    </Button>
  );
}
