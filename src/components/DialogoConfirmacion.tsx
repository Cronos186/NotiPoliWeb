import { useState } from 'react';
import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/* ============================================================
   NotiPoliWeb — Diálogo de confirmación
   Sustituye a los `confirm()` nativos de la versión HTML.
   ============================================================ */

interface DialogoConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: ReactNode;
  textoConfirmar?: string;
  textoCancelar?: string;
  /** `error` para acciones destructivas, `primary` para el resto. */
  colorConfirmar?: 'error' | 'primary';
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function DialogoConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  colorConfirmar = 'error',
  onConfirmar,
  onCancelar,
}: DialogoConfirmacionProps) {
  return (
    <Dialog open={abierto} onClose={onCancelar} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">{mensaje}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancelar} color="inherit">
          {textoCancelar}
        </Button>
        <Button onClick={onConfirmar} color={colorConfirmar} variant="contained" autoFocus>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ============================================================
   Hook de conveniencia para manejar un diálogo de confirmación
   ============================================================ */

interface EstadoConfirmacion<T> {
  abierto: boolean;
  objetivo: T | null;
}

export function useConfirmacion<T>() {
  const [estado, setEstado] = useState<EstadoConfirmacion<T>>({
    abierto: false,
    objetivo: null,
  });

  const abrir = (objetivo: T) => setEstado({ abierto: true, objetivo });
  const cerrar = () => setEstado({ abierto: false, objetivo: null });

  return { ...estado, abrir, cerrar };
}
