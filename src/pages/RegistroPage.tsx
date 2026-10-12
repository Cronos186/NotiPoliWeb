import Container from '@mui/material/Container';
import TarjetaAuth from '@/components/TarjetaAuth';

/* ============================================================
   NotiPoliWeb — Registro de usuario
   Reutiliza la misma tarjeta que la página de inicio de sesión,
   arrancando en la pestaña "Registrarse".
   ============================================================ */

export default function RegistroPage() {
  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 7 } }}>
      <TarjetaAuth modoInicial="registro" nivelTitulo="h1" destinoExito="/favoritos" />
    </Container>
  );
}
