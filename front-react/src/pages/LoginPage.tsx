import { useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import TarjetaAuth from '@/components/TarjetaAuth';

/* ============================================================
   NotiPoliWeb — Iniciar sesión
   La tarjeta y los formularios viven en <TarjetaAuth>, que también
   se reutiliza en el registro y en la página de contacto.
   ============================================================ */

interface EstadoNavegacion {
  desde?: string;
  motivo?: string;
}

/** Mensaje contextual según la sección que exige sesión. */
function mensajeDeAcceso(estado: EstadoNavegacion | null): string | undefined {
  if (!estado?.desde) return undefined;
  if (estado.motivo === 'favoritos') return 'Inicia sesión para guardar tus favoritos.';
  if (estado.desde === '/favoritos') return 'Inicia sesión para ver tus favoritos.';
  if (estado.desde === '/gestionar-noticias') {
    return 'Inicia sesión para gestionar tus noticias.';
  }
  return 'Debes iniciar sesión para acceder a esta sección.';
}

export default function LoginPage() {
  const location = useLocation();
  const estado = (location.state ?? null) as EstadoNavegacion | null;

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 7 } }}>
      <TarjetaAuth
        modoInicial="login"
        nivelTitulo="h1"
        destinoExito={estado?.desde ?? '/favoritos'}
        aviso={mensajeDeAcceso(estado)}
      />
    </Container>
  );
}
