import { useState, useCallback } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "@/context/AuthContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { validarCorreo, validarPassword, validarConfirmacionPassword, validarTerminos, validarApellido, validarNombre } from "@/utils/validaciones";
import { validarCorreoUnico } from "@/services/authService";

type Modo = "login" | "registro";

interface TarjetaAuthProps {
  modoInicial?: Modo;
  destinoExito?: string;
  aviso?: ReactNode;
  nivelTitulo?: "h1" | "h2";
}

export default function TarjetaAuth({
  modoInicial = "login",
  destinoExito,
  aviso,
  nivelTitulo = "h2",
}: TarjetaAuthProps) {
  const [modo, setModo] = useState<Modo>(modoInicial);
  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h2" component={nivelTitulo} sx={{ color: "primary.main", mb: 1, textAlign: "center" }}>
          Mi cuenta
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Accede o crea una cuenta para gestionar tus favoritos.
        </Typography>
        <Tabs value={modo} onChange={(_evento, valor: Modo) => setModo(valor)} variant="fullWidth" sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
          <Tab label="Iniciar sesión" value="login" />
          <Tab label="Registrarse" value="registro" />
        </Tabs>
        {aviso && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {aviso}
          </Alert>
        )}
        {modo === "login" ? (
          <FormularioLogin destinoExito={destinoExito} alCambiarARegistro={() => setModo("registro")} />
        ) : (
          <FormularioRegistro destinoExito={destinoExito} alCambiarALogin={() => setModo("login")} />
        )}
      </CardContent>
    </Card>
  );
}

function AdornoPassword({
  visible,
  alternar,
}: {
  visible: boolean;
  alternar: () => void;
}) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={alternar} edge="end" aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}>
        {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
      </IconButton>
    </InputAdornment>
  );
}

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
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [errores, setErrores] = useState<{ correo?: string; password?: string }>({});
  const [errorGlobal, setErrorGlobal] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleCorreoBlur = useCallback(() => {
    setErrores((previos) => ({ ...previos, correo: validarCorreo(correo) }));
  }, [correo]);

  const handlePasswordBlur = useCallback(() => {
    setErrores((previos) => ({ ...previos, password: validarPassword(password) }));
  }, [password]);

  const handleSubmit = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErrorGlobal("");
    const errorCorreo = validarCorreo(correo);
    const errorPassword = validarPassword(password);
    setErrores({ correo: errorCorreo, password: errorPassword });
    if (errorCorreo || errorPassword) return;
    setEnviando(true);
    window.setTimeout(() => {
      login({ correo, password }).then((resultado) => {
        setEnviando(false);
        if (!resultado.ok) {
          setErrorGlobal(resultado.error ?? "No se pudo iniciar sesión.");
          return;
        }
        mostrar("¡Bienvenido de nuevo, " + (resultado.sesion?.nombre ?? "") + "!", "success");
        if (destinoExito) navigate(destinoExito, { replace: true });
      });
    }, 500);
  };

  return (
    <>
      {errorGlobal && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorGlobal("")}>
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
            onBlur={handleCorreoBlur}
            error={Boolean(errores.correo)}
            helperText={errores.correo ?? " "}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
          />
          <TextField
            id="password"
            label="Contraseña"
            type={verPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrores((previos) => ({ ...previos, password: undefined }));
            }}
            onBlur={handlePasswordBlur}
            error={Boolean(errores.password)}
            helperText={errores.password ?? " "}
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
            sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}
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
            <Link component={RouterLink} to="#" variant="body2" sx={{ color: "primary.main" }}>
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
            {enviando ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </Stack>
      </Box>
      <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
        ¿No tienes cuenta?{" "}
        <Link component="button" type="button" onClick={alCambiarARegistro} sx={{ color: "primary.main", fontWeight: 600, verticalAlign: "baseline" }}>
          Regístrate aquí
        </Link>
      </Typography>
    </>
  );
}

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

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [terminos, setTerminos] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  
  const [recordarme, setRecordarme] = useState(false);
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [errorGlobal, setErrorGlobal] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleCorreoBlur = useCallback(() => {
    setErrores((previos) => ({ ...previos, correo: undefined }));
  }, []);

  const handlePasswordBlur = useCallback(() => {
    setErrores((previos) => ({ ...previos, password: validarPassword(password) }));
  }, [password]);

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setErrorGlobal("");
    console.log("Formulario submit - Datos:", { nombre, apellido, correo, password, password2, terminos });
    const valCorreo = await validarCorreoUnico(correo);
    const nuevosErrores: ErroresRegistro = {
      nombre: validarNombre(nombre),
      apellido: validarApellido(apellido),
      correo: valCorreo,
      password: validarPassword(password),
      password2: validarConfirmacionPassword(password2, password),
      terminos: validarTerminos(terminos),
    };
    console.log("Errores de validación:", nuevosErrores);
    setErrores(nuevosErrores);
    if (Object.values(nuevosErrores).some(Boolean)) {
      mostrar("Revisa los campos marcados en rojo.", "error");
      return;
    }
    setEnviando(true);
    console.log("Iniciando registro con:", { nombre, apellido, correo, password, password2, terminos });
    window.setTimeout(() => {
      registro({ nombre, apellido, correo, password, password2, terminos }).then((resultado) => {
        console.log("Resultado del registro:", resultado);
        setEnviando(false);
        if (!resultado.ok) {
          setErrorGlobal(resultado.error ?? "No se pudo crear la cuenta.");
          return;
        }
        mostrar("¡Bienvenido, " + (resultado.sesion?.nombre ?? "") + "! Tu cuenta fue creada.", "success");
        if (destinoExito) navigate(destinoExito, { replace: true });
      });
    }, 600);
  };

  return (
    <>
      {errorGlobal && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorGlobal("")}>
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
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            id="apellido"
            label="Apellido"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
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
            onBlur={handleCorreoBlur}
            error={Boolean(errores.correo)}
            helperText={errores.correo ?? " "}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
          />
          <TextField
            id="password"
            label="Contraseña"
            type={verPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrores((previos) => ({ ...previos, password: undefined }));
            }}
            onBlur={handlePasswordBlur}
            error={Boolean(errores.password)}
            helperText={errores.password ?? " "}
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
          <TextField
            id="password2"
            label="Confirmar contraseña"
            type={verPassword ? "text" : "password"}
            required
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
              setErrores((previos) => ({ ...previos, password2: undefined }));
            }}
            error={Boolean(errores.password2)}
            helperText={errores.password2 ?? " "}
            placeholder="Repite tu contraseña"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={terminos}
                onChange={(e) => setTerminos(e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="body2">Acepto los términos y condiciones</Typography>}
          />
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}
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
            <Link component={RouterLink} to="#" variant="body2" sx={{ color: "primary.main" }}>
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
            {enviando ? "Registrando..." : "Registrarse"}
          </Button>
        </Stack>
      </Box>
      <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
        ¿Ya tienes cuenta?{" "}
        <Link component="button" type="button" onClick={alCambiarALogin} sx={{ color: "primary.main", fontWeight: 600, verticalAlign: "baseline" }}>
          ¿Iniciar sesión?
        </Link>
      </Typography>
    </>
  );
}