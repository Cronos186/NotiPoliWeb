import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import EstadoVacio from '@/components/EstadoVacio';
import Seccion from '@/components/Seccion';

/* ============================================================
   NotiPoliWeb — Página 404
   ============================================================ */

export default function NotFoundPage() {
  return (
    <Seccion>
      <EstadoVacio
        icono={<ExploreOffIcon />}
        titulo="Página no encontrada"
        texto="La dirección que escribiste no corresponde a ninguna sección del sitio."
        nivelTitulo="h1"
        accion={
          <Button component={RouterLink} to="/" variant="contained" size="large">
            Volver al inicio
          </Button>
        }
      />
    </Seccion>
  );
}
