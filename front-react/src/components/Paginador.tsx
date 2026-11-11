import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

/* ============================================================
   NotiPoliWeb — Paginador
   Se oculta solo si hay una única página, para no añadir ruido.
   ============================================================ */

interface PaginadorProps {
  pagina: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
  /** Resumen tipo "mostrando 1–8 de 10 noticias". */
  resumen?: string;
  /** Ajustes de separación del bloque. */
  sx?: SxProps<Theme>;
}

const etiquetasAria = (tipo: string, pagina: number | null) => {
  switch (tipo) {
    case 'first':
      return 'Primera página';
    case 'previous':
      return 'Página anterior';
    case 'next':
      return 'Página siguiente';
    case 'last':
      return 'Última página';
    default:
      return pagina === null ? 'Ir a una página' : `Ir a la página ${pagina}`;
  }
};

export default function Paginador({
  pagina,
  totalPaginas,
  onCambiar,
  resumen,
  sx,
}: PaginadorProps) {
  if (totalPaginas <= 1) return null;

  return (
    <Stack sx={{ alignItems: 'center', gap: 1.5, mt: 5, ...sx }}>
      <Pagination
        count={totalPaginas}
        page={pagina}
        onChange={(_evento, valor) => onCambiar(valor)}
        color="primary"
        shape="rounded"
        showFirstButton
        showLastButton
        getItemAriaLabel={etiquetasAria}
      />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Página {pagina} de {totalPaginas}
          {resumen ? ` · ${resumen}` : ''}
        </Typography>
      </Box>
    </Stack>
  );
}
