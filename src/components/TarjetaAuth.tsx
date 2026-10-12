import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/context/AuthContext';
import { useNotificacion } from '@/context/NotificacionContext';
import { validarCorreoUnico } from '@/services/authService';
import {
  validarApellido,
  validarConfirmacionPassword,
  validarCorreo,
  validarNombre,
  validarPassword,
  validarTerminos,
} from '@/utils/validaciones';

/* ============================================================
   NotiPoliWeb — Tarjeta "Mi cuenta"
   Contiene las dos pestañas (Iniciar sesión / Registrarse) con sus
   formularios validados. Se usa en las páginas de login y registro y,
   como panel lateral, en Contacto.
   ============================================================ */

type Modo = 'login' | 'registro';

interface TarjetaAuthProps {
  modoInicial?: Modo;
  /** Ruta a la que ir tras autenticarse. Si se omite, permanece en la página. */
  destinoExito?: string;
  /** Aviso informativo sobre las pestañas (por ejemplo, al exigir sesión). */
  aviso?: ReactNode;
  /** Nivel semántico del título de la tarjeta. */
  nivelTitulo?: 'h1' | 'h2';
}

export default function TarjetaAuth({
  modoInicial = 'login',
  destinoExito,
  aviso,
  nivelTitulo = 'h2',
}: TarjetaAuthProps) {
  const [modo, setModo] = useState<Modo>(modoInicial);

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          variant="h2"
          component={nivelTitulo}
          sx={{ color: 'primary.main', mb: 1, textAlign: 'center' }}
        >
          Mi cuenta
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Accede o crea una cuenta para gestionar tus favoritos.
        </Typography>

        <Tabs
          value={modo}
          onChange={(_evento, valor: Modo) => setModo(valor)}
          variant="fullWidth"
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Iniciar sesión" value="login" />
          <Tab label="Registrarse" value="registro" />
        </Tabs>

        {aviso && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {aviso}
          </Alert>
        )}

        {modo === 'login' ? (
          <FormularioLogin
            destinoExito={destinoExito}
            alCambiarARegistro={() => setModo('registro')}
          />
        ) : (
          <FormularioRegistro destinoExito={destinoExito} alCambiarALogin={() => setModo('login')} />
        )}
      </CardContent>
    </Card>
  );
}

/* ============================================================
   Utilidad compartida: botón de mostrar/ocultar contraseña
   ============================================================ */

function AdornoPassword({
  visible,
  alternar,
}: {
  visible: boolean;
  alternar: () => void;
}) {
  return (
    <InputAdornment position="end">
      <IconButton
        onClick={alternar}
        edge="end"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );
}

/* ============================================================
   Formulario: iniciar sesión
   ============================================================ */

function FormularioLogin({
  destinoExito,
  alCambiarARegistro,
}: {
  destinoExito?: string;
  alCambiarARegistro: () => void;
}) {
  const { login } = useAuth();
  const { mostrar } = useNotificacion();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState<{ correo?: string; password?: string }>({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErrorGlobal('');

    const errorCorreo = validarCorreo(correo);
    const errorPassword = validarPassword(password);
    setErrores({ correo: errorCorreo, password: errorPassword });

    if (errorCorreo || errorPassword) return;

    setEnviando(true);

    // Pequeña espera para conservar la sensación de carga original.
    window.setTimeout(() => {
      const resultado = login({ correo, password });
      setEnviando(false);

      if (!resultado.ok) {
        setErrorGlobal(resultado.error ?? 'No se pudo iniciar sesión.');
        return;
      }

      mostrar(`¡Bienvenido de nuevo, ${resultado.sesion?.nombre ?? ''}!`, 'success');
      if (destinoExito) navigate(destinoExito, { replace: true });
    }, 500);
  };

  return (
    <>
      {errorGlobal && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorGlobal('')}>
          {errorGlobal}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            id="correo"
            label="Correo electrónico"
            type="email"
            required
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setErrores((previos) => ({ ...previos, correo: undefined }));
            }}
            onBlur={() => setErrores((previos) => ({ ...previos, correo: validarCorreo(correo) }))}
            error={Boolean(errores.correo)}
            helperText={errores.correo ?? ' '}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
          />

          <TextField
            id="password"
            label="Contraseña"
            type={verPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrores((previos) => ({ ...previos, password: undefined }));
            }}
            onBlur={() =>
              setErrores((previos) => ({ ...previos, password: validarPassword(password) }))
            }
            error={Boolean(errores.password)}
            helperText={errores.password ?? ' '}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <AdornoPassword
                    visible={verPassword}
                    alternar={() => setVerPassword((visible) => !visible)}
                  />
                ),
              },
            }}
          />

          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">Recordarme</Typography>}
            />

            <Link component={RouterLink} to="#" variant="body2" sx={{ color: 'primary.main' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando}
            startIcon={<LoginIcon />}
            fullWidth
          >
            {enviando ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        ¿No tienes cuenta?{' '}
        <Link
          component="button"
          type="button"
          onClick={alCambiarARegistro}
          sx={{ color: 'primary.main', fontWeight: 600, verticalAlign: 'baseline' }}
        >
          Regístrate aquí
        </Link>
      </Typography>
    </>
  );
}

/* ============================================================
   Formulario: registro
   ============================================================ */

interface ErroresRegistro {
  nombre?: string;
  apellido?: string;
  correo?: string;
  password?: string;
  password2?: string;
  terminos?: string;
}

function FormularioRegistro({
  destinoExito,
  alCambiarALogin,
}: {
  destinoExito?: string;
  alCambiarALogin: () => void;
}) {
  const { registro } = useAuth();
  const { mostrar } = useNotificacion();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [verPassword2, setVerPassword2] = useState(false);
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [errorGlobal, setErrorGlobal] = useState('');
  const [enviando, setEnviando] = useState(false);

  const limpiarError = (campo: keyof ErroresRegistro) =>
    setErrores((previos) => ({ ...previos, [campo]: undefined }));

  const handleSubmit = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErrorGlobal('');

    const nuevosErrores: ErroresRegistro = {
      nombre: validarNombre(nombre),
      apellido: validarApellido(apellido),
      correo: validarCorreoUnico(correo),
      password: validarPassword(password),
      password2: validarConfirmacionPassword(password2, password),
      terminos: validarTerminos(terminos),
    };
    setErrores(nuevosErrores);

    if (Object.values(nuevosErrores).some(Boolean)) {
      mostrar('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    setEnviando(true);

    window.setTimeout(() => {
      const resultado = registro({ nombre, apellido, correo, password, password2, terminos });
      setEnviando(false);

      if (!resultado.ok) {
        setErrorGlobal(resultado.error ?? 'No se pudo crear la cuenta.');
        return;
      }

      mostrar(`¡Bienvenido, ${resultado.sesion?.nombre ?? ''}! Tu cuenta fue creada.`, 'success');
      if (destinoExito) navigate(destinoExito, { replace: true });
    }, 600);
  };

  return (
    <>
      {errorGlobal && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorGlobal('')}>
          {errorGlobal}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            id="nombre"
            label="Nombre"
            required
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              limpiarError('nombre');
            }}
            onBlur={() => setErrores((p) => ({ ...p, nombre: validarNombre(nombre) }))}
            error={Boolean(errores.nombre)}
            helperText={errores.nombre ?? ' '}
            placeholder="Ingresa tu nombre"
            autoComplete="given-name"
          />

          <TextField
            id="apellido"
            label="Apellido"
            required
            value={apellido}
            onChange={(e) => {
              setApellido(e.target.value);
              limpiarError('apellido');
            }}
            onBlur={() => setErrores((p) => ({ ...p, apellido: validarApellido(apellido) }))}
            error={Boolean(errores.apellido)}
            helperText={errores.apellido ?? ' '}
            placeholder="Ingresa tu apellido"
            autoComplete="family-name"
          />

          <TextField
            id="correo"
            label="Correo electrónico"
            type="email"
            required
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              limpiarError('correo');
            }}
            onBlur={() => setErrores((p) => ({ ...p, correo: validarCorreoUnico(correo) }))}
            error={Boolean(errores.correo)}
            helperText={errores.correo ?? ' '}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
          />

          <TextField
            id="password"
            label="Contraseña"
            type={verPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              limpiarError('password');
            }}
            onBlur={() => setErrores((p) => ({ ...p, password: validarPassword(password) }))}
            error={Boolean(errores.password)}
            helperText={errores.password ?? ' '}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <AdornoPassword
                    visible={verPassword}
                    alternar={() => setVerPassword((v) => !v)}
                  />
                ),
              },
            }}
          />

          <TextField
            id="password2"
            label="Confirmar contraseña"
            type={verPassword2 ? 'text' : 'password'}
            required
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
              limpiarError('password2');
            }}
            onBlur={() =>
              setErrores((p) => ({
                ...p,
                password2: validarConfirmacionPassword(password2, password),
              }))
            }
            error={Boolean(errores.password2)}
            helperText={errores.password2 ?? ' '}
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            slotProps={{
              input: {
                endAdornment: (
                  <AdornoPassword
                    visible={verPassword2}
                    alternar={() => setVerPassword2((v) => !v)}
                  />
                ),
              },
            }}
          />

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={terminos}
                  onChange={(e) => {
                    setTerminos(e.target.checked);
                    limpiarError('terminos');
                  }}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  Acepto los{' '}
                  <Link component={RouterLink} to="#" sx={{ color: 'primary.main' }}>
                    Términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link component={RouterLink} to="#" sx={{ color: 'primary.main' }}>
                    Política de privacidad
                  </Link>
                </Typography>
              }
            />

            <FormHelperText
              error={Boolean(errores.terminos)}
              sx={{ ml: 0, visibility: errores.terminos ? 'visible' : 'hidden' }}
            >
              {errores.terminos ?? ' '}
            </FormHelperText>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando}
            startIcon={<PersonAddIcon />}
            fullWidth
          >
            {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </Stack>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
        ¿Ya tienes cuenta?{' '}
        <Link
          component="button"
          type="button"
          onClick={alCambiarALogin}
          sx={{ color: 'primary.main', fontWeight: 600, verticalAlign: 'baseline' }}
        >
          Inicia sesión aquí
        </Link>
      </Typography>
    </>
  );
}
