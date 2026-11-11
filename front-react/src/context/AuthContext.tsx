import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getSesion, iniciarSesion, limpiarSesion, registrarUsuario } from '@/services/authService';
import type { CredencialesLogin, DatosRegistro, ResultadoAuthConSesion, Sesion } from '@/types';

interface AuthContextValue {
  sesion: Sesion | null;
  autenticado: boolean;
  login: (credenciales: CredencialesLogin) => Promise<ResultadoAuthConSesion>;
  registro: (datos: DatosRegistro) => Promise<ResultadoAuthConSesion>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() => getSesion());

  const login = useCallback(async (credenciales: CredencialesLogin) => {
    const resultado = await iniciarSesion(credenciales.correo, credenciales.password);
    if (resultado.ok && resultado.sesion) {
      setSesion(resultado.sesion);
    }
    return resultado;
  }, []);

  const registro = useCallback(async (datos: DatosRegistro) => {
    const resultado = await registrarUsuario(datos);
    if (resultado.ok && resultado.sesion) {
      setSesion(resultado.sesion);
    }
    return resultado;
  }, []);

  const cerrarSesion = useCallback(() => {
    limpiarSesion();
    setSesion(null);
  }, []);

  const valor = useMemo<AuthContextValue>(() => ({ sesion, autenticado: sesion !== null, login, registro, cerrarSesion }), [sesion, login, registro, cerrarSesion]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return contexto;
}
