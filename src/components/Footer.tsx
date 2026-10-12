import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DATOS_PROYECTO, MARCA } from '@/constants';

/* ============================================================
   NotiPoliWeb — Pie de página
   ============================================================ */

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: MARCA.footer, color: MARCA.footerTexto, py: 5, mt: 'auto' }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            fontSize: '0.875rem',
          }}
        >
          <Typography variant="body2" color="inherit">
            © {DATOS_PROYECTO.anio} {DATOS_PROYECTO.nombre}. Todos los derechos reservados.
          </Typography>

          <Link
            href={`mailto:${DATOS_PROYECTO.correo}`}
            color="inherit"
            underline="hover"
            variant="body2"
          >
            {DATOS_PROYECTO.correo}
          </Link>

          <Stack direction="row" spacing={2}>
            {DATOS_PROYECTO.redes.map((red) => (
              <Link
                key={red}
                href="#"
                color="secondary.main"
                underline="hover"
                variant="body2"
              >
                {red}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
