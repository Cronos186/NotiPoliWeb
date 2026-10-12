import { useState } from 'react';
import type { FormEvent } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { useNotificacion } from '@/context/NotificacionContext';
import { guardarMensaje } from '@/services/contactoService';
import { validarCorreo, validarMensaje, validarNombre } from '@/utils/validaciones';

/* ============================================================
   NotiPoliWeb — Formulario de contacto
   Reemplaza a contacto.html + contacto.js.

   El formulario se presenta dentro de la misma tarjeta que el resto
   de vistas de la aplicación.
   ============================================================ */

interface ValoresContacto {
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
}

type ErroresContacto = Partial<Record<keyof ValoresContacto, string>>;

const VALORES_INICIALES: ValoresContacto = {
  nombre: '',
  correo: '',
  asunto: '',
  mensaje: '',
};

export default function ContactoPage() {
  const { mostrar } = useNotificacion();

  const [valores, setValores] = useState<ValoresContacto>(VALORES_INICIALES);
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const validarTodo = (datos: ValoresContacto): ErroresContacto => ({
    // En contacto el nombre exige al menos 3 caracteres.
    nombre: validarNombre(datos.nombre, 3),
    correo: validarCorreo(datos.correo),
    mensaje: validarMensaje(datos.mensaje),
  });

  const actualizar = (campo: keyof ValoresContacto, valor: string) => {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  };

  const validarCampo = (campo: keyof ValoresContacto) => {
    const resultado = validarTodo(valores)[campo];
    setErrores((previos) => ({ ...previos, [campo]: resultado }));
  };

  const handleSubmit = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const nuevosErrores = validarTodo(valores);
    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) {
      mostrar('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    setEnviando(true);

    // Se simula el envío para conservar el comportamiento original.
    window.setTimeout(() => {
      guardarMensaje({
        nombre: valores.nombre.trim(),
        correo: valores.correo.trim(),
        asunto: valores.asunto.trim(),
        mensaje: valores.mensaje.trim(),
        fecha: new Date().toISOString(),
      });

      setValores(VALORES_INICIALES);
      setErrores({});
      setEnviando(false);
      setEnviado(true);
    }, 800);
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, md: 3 }, py: { xs: 5, md: 7 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{ color: 'primary.main', mb: 1, textAlign: 'center' }}
          >
            Contáctanos
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            ¿Tienes alguna pregunta o sugerencia? Escríbenos y te responderemos pronto.
          </Typography>

          {enviado && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setEnviado(false)}>
              ¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos pronto.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                id="nombre"
                label="Nombre"
                required
                value={valores.nombre}
                onChange={(e) => actualizar('nombre', e.target.value)}
                onBlur={() => validarCampo('nombre')}
                error={Boolean(errores.nombre)}
                helperText={errores.nombre ?? ' '}
                placeholder="Ingresa tu nombre completo"
                autoComplete="name"
              />

              <TextField
                id="correo"
                label="Correo electrónico"
                type="email"
                required
                value={valores.correo}
                onChange={(e) => actualizar('correo', e.target.value)}
                onBlur={() => validarCampo('correo')}
                error={Boolean(errores.correo)}
                helperText={errores.correo ?? ' '}
                placeholder="tu@correo.com"
                autoComplete="email"
              />

              <TextField
                id="asunto"
                label="Asunto"
                value={valores.asunto}
                onChange={(e) => actualizar('asunto', e.target.value)}
                helperText=" "
                placeholder="Asunto del mensaje"
                autoComplete="off"
              />

              <TextField
                id="mensaje"
                label="Mensaje"
                required
                multiline
                minRows={6}
                value={valores.mensaje}
                onChange={(e) => actualizar('mensaje', e.target.value)}
                onBlur={() => validarCampo('mensaje')}
                error={Boolean(errores.mensaje)}
                helperText={errores.mensaje ?? ' '}
                placeholder="Escribe tu mensaje..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={enviando}
                startIcon={<SendIcon />}
                fullWidth
              >
                {enviando ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
