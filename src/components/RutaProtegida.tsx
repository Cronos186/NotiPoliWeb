import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/* ============================================================
   NotiPoliWeb — Ruta protegida
   Reemplaza el patrón `verificarSesion()` + `alert()` + redirect
   que repetían favoritos.js y crud.js en la versión HTML.
   ============================================================ */

export default function RutaProtegida({ children }: { children: ReactNode }) {
  const { sesion } = useAuth();
  const location = useLocation();

  if (!sesion) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ desde: location.pathname, motivo: 'sesion' }}
      />
    );
  }

  return <>{children}</>;
}
