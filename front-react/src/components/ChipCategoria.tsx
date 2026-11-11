import Chip from '@mui/material/Chip';
import { chipCategoriaSx } from '@/theme';
import type { Categoria } from '@/types';

/* ============================================================
   NotiPoliWeb — Chip de categoría
   Equivale a `.card__categoria` del CSS original.
   ============================================================ */

export default function ChipCategoria({ categoria }: { categoria: Categoria }) {
  return <Chip label={categoria} size="small" sx={chipCategoriaSx} />;
}
