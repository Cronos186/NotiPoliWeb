import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNoticias } from "@/context/NoticiasContext";
import { getUsuarios } from "@/services/authService";
import { DATOS_PROYECTO } from "@/constants";
import { heroGradientSx } from "@/theme";

/* ============================================================
   NotiPoliWeb Â Acerca de
   Reemplaza a acerca-de.html + acerca.js, incluyendo los
   contadores animados de las estadÃ­sticas.
   ============================================================ */

/** Contador animado: reproduce `animarContador()` de acerca.js. */
function Contador({ valor }: { valor: number }) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const duracion = 800;
    const inicio = performance.now();
    let frame = 0;

    const animar = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      setActual(Math.round(valor * progreso));
      if (progreso < 1) frame = requestAnimationFrame(animar);
    };

    frame = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(frame);
  }, [valor]);

  return <>{actual}</>;
}

const PILARES: { icono: ReactNode; titulo: string; texto: string }[] = [
  {
    icono: <TrackChangesIcon />,
    titulo: "Misión",
    texto:
      "Ofrecer un espacio digital accesible donde las personas puedan informarse, compartir experiencias y construir comunidad en torno a la información veraz.",
  },
  {
    icono: <VisibilityIcon />,
    titulo: "Visión",
    texto:
      "Ser la plataforma de referencia regional para la publicación de noticias colaborativas, reconocida por su diseÃ±o intuitivo y su compromiso con la verdad.",
  },
  {
    icono: <VolunteerActivismIcon />,
    titulo: "Valores",
    texto:
      "Transparencia, respeto por la diversidad de opiniones, innovación constante y compromiso con el acceso libre a la información.",
  },
];

const PARRAFOS = [
  `NotiPoliWeb nació como una iniciativa para conectar a la comunidad con las historias que importan. Somos un equipo de estudiantes y profesionales apasionados por el periodismo digital y la tecnologÃ­a.`,
  `Nuestra plataforma permite a los usuarios no solo leer noticias, sino tambiÃ©n publicar sus propias experiencias, guardar sus favoritos y participar activamente en la construcción de un espacio informativo colaborativo.`,
  `Creemos que la información debe ser accesible, veraz y cercana. Por eso trabajamos cada dÃ­a para ofrecer una experiencia intuitiva, moderna y Ãºtil para todos.`,
];

export default function AcercaDePage() {
  const { noticias } = useNoticias();
  const [totalUsuarios, setTotalUsuarios] = useState(0);

  useEffect(() => {
    getUsuarios().then((usuarios) => setTotalUsuarios(usuarios.length));
  }, []);

  const estadisticas: {
    valor: number;
    etiqueta: string;
    animado?: boolean;
    sufijo?: string;
  }[] = [
    { valor: noticias.length, etiqueta: "Noticias publicadas", animado: true },
    { valor: 4, etiqueta: "Categorias activas" },
    { valor: totalUsuarios, etiqueta: "Usuarios registrados", animado: true },
    { valor: 100, etiqueta: "Gratuito y abierto", sufijo: "%" },
  ];

  return (
    <>
      {/* ==================== HERO ==================== */}
      <Box component="section" sx={heroGradientSx}>
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          Acerca de {DATOS_PROYECTO.nombre}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
          {DATOS_PROYECTO.eslogan}
        </Typography>
      </Box>

      {/* ==================== ESTADÃSTICAS ==================== */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack direction="row" spacing={4} sx={{ justifyContent: "center", flexWrap: "wrap" }}>
          {estadisticas.map((stat, idx) => (
            <Paper key={idx} elevation={2} sx={{ p: 3, textAlign: "center", minWidth: 200, flexGrow: 1 }}>
              {stat.animado ? (
                <Contador valor={stat.valor} />
              ) : (
                <Typography variant="h3" component="div">
                  {stat.valor}{stat.sufijo}
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary">
                {stat.etiqueta}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>

      {/* ==================== PILARES ==================== */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 4, textAlign: "center" }}>
          Nuestros pilares
        </Typography>
        <Stack direction="row" spacing={4} sx={{ justifyContent: "center", flexWrap: "wrap" }}>
          {PILARES.map((pilar, idx) => (
            <Paper key={idx} elevation={1} variant="outlined" sx={{ p: 3, maxWidth: 350, flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ p: 1, mr: 2, backgroundColor: "primary.light", borderRadius: 1 }}>
                  {pilar.icono}
                </Box>
                <Typography variant="h5" component="h3">
                  {pilar.titulo}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {pilar.texto}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>

      {/* ==================== HISTORIA ==================== */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 4, textAlign: "center" }}>
          Nuestra historia
        </Typography>
        <Stack spacing={3} sx={{ maxWidth: 800, mx: "auto" }}>
          {PARRAFOS.map((parrafo, idx) => (
            <Paper key={idx} elevation={1} variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {parrafo}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Container>

      {/* ==================== CTA ==================== */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)", color: "white" }}>
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Â¿Listo para unirte?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
            RegÃ­strate gratis y empieza a publicar, comentar y guardar tus noticias favoritas.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            component={RouterLink}
            to="/registro"
            startIcon={<PersonAddIcon />}
          >
            Crear mi cuenta
          </Button>
        </Paper>
      </Container>

      {/* ==================== FOOTER ==================== */}
      <Box component="footer" sx={{ py: 4, textAlign: "center", backgroundColor: "background.default", borderTop: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
          {DATOS_PROYECTO.nombre} &copy; {new Date().getFullYear()} Â· Hecho con React + TypeScript
        </Typography>
      </Box>
    </>
  );
}

