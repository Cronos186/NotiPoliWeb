import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import type { AlertColor } from '@mui/material';

/* ============================================================
   NotiPoliWeb — Notificaciones globales
   Reemplaza los `alert()` de la versión HTML por un Snackbar de MUI.
   ============================================================ */

interface NotificacionContextValue {
  mostrar: (mensaje: string, severidad?: AlertColor) => void;
}

const NotificacionContext = createContext<NotificacionContextValue | null>(null);

export function NotificacionProvider({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [severidad, setSeveridad] = useState<AlertColor>('success');

  const mostrar = useCallback((texto: string, tipo: AlertColor = 'success') => {
    setMensaje(texto);
    setSeveridad(tipo);
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => setAbierto(false), []);

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <NotificacionContext.Provider value={valor}>
      {children}
      <Snackbar
        open={abierto}
        autoHideDuration={4000}
        onClose={cerrar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={severidad} variant="filled" onClose={cerrar} sx={{ width: '100%' }}>
          {mensaje}
        </Alert>
      </Snackbar>
    </NotificacionContext.Provider>
  );
}

export function useNotificacion(): NotificacionContextValue {
  const contexto = useContext(NotificacionContext);
  if (!contexto) {
    throw new Error('useNotificacion debe usarse dentro de <NotificacionProvider>');
  }
  return contexto;
}
