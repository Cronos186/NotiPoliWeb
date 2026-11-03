import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArticleIcon from "@mui/icons-material/Article";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import DialogoConfirmacion, { useConfirmacion } from "@/components/DialogoConfirmacion";
import Seccion from "@/components/Seccion";
import TablaNoticias from "@/components/TablaNoticias";
import { CATEGORIAS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useNoticias } from "@/context/NoticiasContext";
import { useNotificacion } from "@/context/NotificacionContext";
import {
  validarCategoria,
  validarContenido,
  validarDescripcion,
  validarImagen,
  validarTitulo,
} from "@/utils/validaciones";
import type { Noticia, NoticiaFormValues } from "@/types";

/* ============================================================
   NotiPoliWeb — Gestionar noticias (vista unificada)

   Reproduce el wireframe 08 completo en una sola pantalla:
     · columna izquierda — CREAR NUEVA NOTICIA
     · columna derecha   — MIS NOTICIAS PUBLICADAS (con Eliminar)
                         + OTRAS NOTICIAS DE LA COMUNIDAD (solo lectura)

   Flujo C del wireframe 10: solo el autor puede eliminar su noticia;
   las de otros usuarios aparecen con el botón "Bloqueado".
   ============================================================ */

type CampoFormulario = keyof NoticiaFormValues;

const VALORES_INICIALES: NoticiaFormValues = {
  titulo: "",
  categoria: "",
  imagen: "",
  descripcion: "",
  contenido: "",
};

const VALIDADORES: Record<CampoFormulario, (valor: string) => string> = {
  titulo: validarTitulo,
  categoria: validarCategoria,
  imagen: validarImagen,
  descripcion: validarDescripcion,
  contenido: validarContenido,
};

export default function GestionarNoticiasPage() {
  const { sesion } = useAuth();
  const { crear, eliminar, noticiasDeAutor, noticiasDeOtros } = useNoticias();
  const { mostrar } = useNotificacion();
  const confirmacion = useConfirmacion<Noticia>();

  const [valores, setValores] = useState<NoticiaFormValues>(VALORES_INICIALES);
  const [errores, setErrores] = useState<Partial<Record<CampoFormulario, string>>>({});

  const misNoticias = useMemo(
    () => (sesion ? noticiasDeAutor(sesion.email) : []),
    [sesion, noticiasDeAutor],
  );

  const otrasNoticias = useMemo(
    () => (sesion ? noticiasDeOtros(sesion.email) : []),
    [sesion, noticiasDeOtros],
  );

  const actualizar = (campo: keyof NoticiaFormValues, valor: string) => {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  };

  const validarCampo = (campo: keyof NoticiaFormValues) =>
    setErrores((previos) => ({ ...previos, [campo]: VALIDADORES[campo](valores[campo]) }));

  const limpiarFormulario = () => {
    setValores(VALORES_INICIALES);
    setErrores({});
  };

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const nuevosErrores: Partial<Record<keyof NoticiaFormValues, string>> = {};
    (Object.keys(VALIDADORES) as (keyof NoticiaFormValues)[]).forEach((campo) => {
      nuevosErrores[campo] = VALIDADORES[campo](valores[campo]);
    });
    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) {
      mostrar("Revisa los campos marcados en rojo.", "error");
      return;
    }

    const nueva = await crear(valores);
    if (!nueva) {
      mostrar("No se pudo publicar la noticia.", "error");
      return;
    }

    limpiarFormulario();
    mostrar(`La noticia "${nueva.titulo}" fue publicada correctamente.`, "success");
  };

  const confirmarEliminar = async () => {
    const objetivo = confirmacion.objetivo;
    if (!objetivo || !sesion) return;

    // Doble verificación de autoría antes de borrar.
    if (objetivo.autorEmail !== sesion.email) {
      mostrar("No puedes eliminar noticias de otros autores.", "error");
      confirmacion.cerrar();
      return;
    }

    await eliminar(objetivo.id);
    confirmacion.cerrar();
    mostrar(`La noticia "${objetivo.titulo}" fue eliminada.`, "info");
  };

  return (
    <>
      <Seccion
        titulo="Gestionar Noticias"
        subtitulo="Crea nuevas noticias y administra las que tú mismo has publicado."
        nivelTitulo="h1"
        divisor
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
          {/* ===== COLUMNA IZQUIERDA: CREAR NOTICIA ===== */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <AddCircleIcon fontSize="small" /> Crear nueva noticia
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                  <Stack spacing={3}>
                    <TextField
                      id="titulo"
                      label="Título"
                      required
                      fullWidth
                      value={valores.titulo}
                      onChange={(e) => actualizar("titulo", e.target.value)}
                      onBlur={() => validarCampo("titulo")}
                      error={Boolean(errores.titulo)}
                      helperText={errores.titulo ?? " "}
                      placeholder="Título atractivo y descriptivo"
                    />
                    <TextField
                      id="categoria"
                      label="Categoría"
                      select
                      required
                      fullWidth
                      value={valores.categoria}
                      onChange={(e) => actualizar("categoria", e.target.value)}
                      onBlur={() => validarCampo("categoria")}
                      error={Boolean(errores.categoria)}
                      helperText={errores.categoria ?? " "}
                    >
                      {CATEGORIAS.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      id="imagen"
                      label="URL de la imagen"
                      required
                      fullWidth
                      value={valores.imagen}
                      onChange={(e) => actualizar("imagen", e.target.value)}
                      onBlur={() => validarCampo("imagen")}
                      error={Boolean(errores.imagen)}
                      helperText={errores.imagen ?? " "}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <TextField
                      id="descripcion"
                      label="Descripción breve"
                      required
                      fullWidth
                      multiline
                      rows={3}
                      value={valores.descripcion}
                      onChange={(e) => actualizar("descripcion", e.target.value)}
                      onBlur={() => validarCampo("descripcion")}
                      error={Boolean(errores.descripcion)}
                      helperText={errores.descripcion ?? " "}
                      placeholder="Resumen en una o dos frases"
                    />
                    <TextField
                      id="contenido"
                      label="Contenido completo"
                      required
                      fullWidth
                      multiline
                      rows={8}
                      value={valores.contenido}
                      onChange={(e) => actualizar("contenido", e.target.value)}
                      onBlur={() => validarCampo("contenido")}
                      error={Boolean(errores.contenido)}
                      helperText={errores.contenido ?? " "}
                      placeholder="Desarrollo completo de la noticia..."
                    />
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                      <Button variant="outlined" type="button" onClick={limpiarFormulario}>
                        Limpiar
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        size="large"
                        startIcon={<AddCircleIcon />}
                      >
                        Publicar noticia
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </CardContent>
            </Card>
          </Box>

          {/* ===== COLUMNA DERECHA: LISTADO ===== */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card elevation={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <ArticleIcon fontSize="small" /> Mis noticias
                </Typography>
                {misNoticias.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                    No has publicado ninguna noticia todavía.
                  </Typography>
                ) : (
                  <TablaNoticias
                    noticias={misNoticias}
                    esMovil={false}
                    soloLectura={false}
                    onEliminar={(n) => confirmacion.abrir(n)}
                    mensajeVacio={"No has publicado ninguna noticia todavía."}
                  />
                )}

                <Divider sx={{ my: 4 }} />

                <Typography variant="h5" component="h2" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                  <NewspaperIcon fontSize="small" /> Otras noticias de la comunidad
                </Typography>
                {otrasNoticias.length === 0 ? (
                  <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                    No hay otras noticias disponibles.
                  </Typography>
                ) : (
                  <TablaNoticias
                    noticias={otrasNoticias}
                    esMovil={false}
                    soloLectura={true}
                    mensajeVacio={"No hay otras noticias disponibles."}
                  />
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        <DialogoConfirmacion
          abierto={confirmacion.abierto}
          titulo="Eliminar noticia?"
          mensaje="Esta acción no se puede deshacer."
          textoConfirmar="Eliminar"
          colorConfirmar="error"
          onConfirmar={confirmarEliminar}
          onCancelar={confirmacion.cerrar}
        />
      </Seccion>
    </>
  );
}