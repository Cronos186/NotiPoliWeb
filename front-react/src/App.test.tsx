import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import App from '@/App';
import { STORAGE_KEYS } from '@/services/storage';
import { cargarSemillas } from '@/services/seeds';

/* ============================================================
   NotiPoliWeb — Pruebas de humo de la migración a React
   Verifican el enrutado, las vistas principales, la protección de
   rutas y la paginación, siguiendo los wireframes de la Entrega 1.
   ============================================================ */

/** Coloca el navegador simulado en una ruta antes de montar la app. */
function irA(ruta: string) {
  window.history.pushState({}, '', ruta);
}

/** Simula una sesión ya iniciada, como la que deja el login. */
function iniciarSesionPrueba(email: string, nombre: string, apellido: string) {
  localStorage.setItem(STORAGE_KEYS.SESION, JSON.stringify({ email, nombre, apellido }));
}

beforeAll(() => {
  localStorage.clear();
  cargarSemillas();
});

// Las pruebas de rutas públicas no deben heredar una sesión previa.
afterEach(() => {
  localStorage.removeItem(STORAGE_KEYS.SESION);
});

describe('Rutas y vistas principales', () => {
  it('renderiza el inicio con las tres noticias destacadas', () => {
    irA('/');
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Bienvenido a NotiPoliWeb/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /Noticias Destacadas/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Ver más' })).toHaveLength(3);
  });

  it('redirige a iniciar sesión al abrir favoritos sin sesión', () => {
    irA('/favoritos');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Mi cuenta/i })).toBeInTheDocument();
    expect(screen.getByText(/Inicia sesión para ver tus favoritos/i)).toBeInTheDocument();
  });

  it('muestra el detalle con sus noticias relacionadas', () => {
    irA('/noticias/1');
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Innovación Educativa/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /Noticias Relacionadas/i })).toBeInTheDocument();
    // Innovación Educativa (1) es de Educación: relacionadas = ids 5 y 101.
    expect(screen.getAllByRole('link', { name: /Educación/ })).toHaveLength(2);
  });

  it('la página 404 aparece en una ruta desconocida', () => {
    irA('/ruta-que-no-existe');
    render(<App />);

    expect(screen.getByRole('heading', { name: /Página no encontrada/i })).toBeInTheDocument();
  });
});

/* ============================================================
   Paginación: evita que los listados crezcan sin control
   ============================================================ */

describe('Paginación', () => {
  it('pagina el listado de noticias de 6 en 6', async () => {
    const usuario = userEvent.setup();
    irA('/noticias');
    render(<App />);

    expect(screen.getByText(/Página 1 de 2/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Ver más' })).toHaveLength(6);

    await usuario.click(screen.getByRole('button', { name: 'Ir a la página 2' }));

    expect(screen.getByText(/Página 2 de 2/i)).toBeInTheDocument();
    // 10 noticias sembradas: quedan 4 en la segunda página.
    expect(screen.getAllByRole('link', { name: 'Ver más' })).toHaveLength(4);
  });

  it('vuelve a la primera página al cambiar de categoría', async () => {
    const usuario = userEvent.setup();
    irA('/noticias');
    render(<App />);

    await usuario.click(screen.getByRole('button', { name: 'Ir a la página 2' }));
    expect(screen.getByText(/Página 2 de 2/i)).toBeInTheDocument();

    await usuario.click(screen.getByRole('button', { name: 'Educativas' }));

    // Educación tiene 3 noticias (ids 1, 5 y 101): una sola página, sin paginador.
    expect(screen.queryByText(/Página 2 de/i)).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Ver más' })).toHaveLength(3);
  });

  it('pagina el listado de comunidad del CRUD de 5 en 5', async () => {
    const usuario = userEvent.setup();
    iniciarSesionPrueba('juan@mail.com', 'Juan', 'Pérez');
    irA('/gestionar-noticias');
    render(<App />);

    // Flujo C: las noticias ajenas (7) se bloquean; se ven 5 por página.
    expect(screen.getAllByRole('button', { name: /Bloqueado/i })).toHaveLength(5);

    await usuario.click(screen.getByRole('button', { name: 'Ir a la página 2' }));

    expect(screen.getAllByRole('button', { name: /Bloqueado/i })).toHaveLength(2);
  });
});

/* ============================================================
   Contacto: formulario con el diseño de tarjeta del resto de vistas
   ============================================================ */

describe('Contacto', () => {
  it('muestra el formulario de contacto sin la caja de acceso', () => {
    irA('/contacto');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Contáctanos/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();

    // La tarjeta "Mi cuenta" no debe aparecer en esta vista.
    expect(screen.queryByRole('heading', { name: /Mi cuenta/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: /Iniciar sesión/i })).not.toBeInTheDocument();
  });
});

/* ============================================================
   Autenticación: la tarjeta compartida por Login, Registro y Contacto
   ============================================================ */

describe('Autenticación', () => {
  it('permite iniciar sesión desde el formulario y redirige a favoritos', async () => {
    const usuario = userEvent.setup();
    irA('/login');
    render(<App />);

    await usuario.type(screen.getByLabelText(/Correo electrónico/i), 'juan@mail.com');
    await usuario.type(screen.getByLabelText(/^Contraseña/i), '123456');
    await usuario.click(screen.getByRole('button', { name: /^Iniciar sesión$/i }));

    expect(
      await screen.findByRole('heading', { level: 1, name: /Mis Favoritos/i }, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 noticias guardadas por Juan/i)).toBeInTheDocument();
  });

  it('cambia entre las pestañas de la tarjeta sin salir de la página', async () => {
    const usuario = userEvent.setup();
    irA('/login');
    render(<App />);

    await usuario.click(screen.getByRole('tab', { name: /Registrarse/i }));

    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirmar contraseña/i)).toBeInTheDocument();
  });
});

/* ============================================================
   Vista unificada de gestión de noticias
   El wireframe 08 concentra los tres bloques en una sola pantalla.
   ============================================================ */

describe('Vista unificada de noticias', () => {
  it('reúne creación, mis noticias y comunidad en una sola pantalla', () => {
    iniciarSesionPrueba('juan@mail.com', 'Juan', 'Pérez');
    irA('/gestionar-noticias');
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Gestionar Noticias/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /Crear Nueva Noticia/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Mis Noticias Publicadas/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Otras Noticias de la Comunidad/i }),
    ).toBeInTheDocument();

    // Juan es autor de las noticias 1, 5 y 101: las 3 tienen acción de borrado.
    expect(screen.getAllByRole('button', { name: /^Eliminar$/ })).toHaveLength(3);
  });

  it('redirige la antigua ruta /mis-noticias a la vista unificada', () => {
    iniciarSesionPrueba('juan@mail.com', 'Juan', 'Pérez');
    irA('/mis-noticias');
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Gestionar Noticias/i }),
    ).toBeInTheDocument();
  });

  it('el menú privado ya no ofrece dos destinos para lo mismo', async () => {
    const usuario = userEvent.setup();
    iniciarSesionPrueba('juan@mail.com', 'Juan', 'Pérez');
    irA('/');
    render(<App />);

    await usuario.click(screen.getByRole('button', { name: 'Juan' }));
    const menu = screen.getByRole('menu');

    expect(
      within(menu).getByRole('menuitem', { name: /Gestionar noticias/i }),
    ).toBeInTheDocument();
    expect(
      within(menu).queryByRole('menuitem', { name: /Mis noticias/i }),
    ).not.toBeInTheDocument();
  });
});
