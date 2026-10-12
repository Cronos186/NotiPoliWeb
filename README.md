# 📰 NotiPoliWeb

Aplicación web tipo periódico digital desarrollada como proyecto del módulo **Desarrollo de Front-end**. Permite a los usuarios explorar noticias, guardar favoritos, publicar sus propias experiencias y gestionar su cuenta.

> **Entrega 3 — Migración a React + TypeScript + Material UI.**
> La versión original en HTML, CSS y JavaScript vanilla se conserva intacta en [`legacy/`](legacy/) como referencia.

---

## 📋 Descripción

**NotiPoliWeb** es una plataforma colaborativa donde los usuarios pueden:

- 📖 Explorar noticias clasificadas en cuatro categorías: **Educación, Tecnología, Turismo y Comercial**.
- ♥ Guardar noticias en favoritos (persistencia por usuario).
- ✍ Publicar sus propias noticias (Mini CRUD).
- 🗑 Eliminar únicamente las noticias que ellos mismos han creado.
- 👤 Registrarse, iniciar sesión y gestionar su cuenta.
- 📬 Contactar al equipo mediante un formulario validado.

---

## 🚀 Puesta en marcha

Requisitos: **Node.js 22.12 o superior** (recomendado Node 24 LTS).

```bash
npm install       # instala las dependencias
npm run dev       # servidor de desarrollo en http://localhost:5173
```

Otros comandos disponibles:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run build` | Comprueba tipos y genera la build de producción en `dist/` |
| `npm run preview` | Sirve localmente la build de producción |
| `npm run typecheck` | Solo la comprobación de tipos de TypeScript |
| `npm test` | Ejecuta la suite de pruebas una vez |
| `npm run test:watch` | Pruebas en modo vigilancia |

### Usuarios de prueba

Los datos semilla se cargan automáticamente la primera vez que se abre la aplicación:

| Correo | Contraseña |
|--------|------------|
| `juan@mail.com` | `123456` |
| `maria@mail.com` | `123456` |
| `carlos@mail.com` | `123456` |
| `ana@mail.com` | `123456` |

---

## 🛠 Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| **React 19** | Componentes y composición de la interfaz |
| **TypeScript** | Tipado estático de modelos, props y servicios |
| **Material UI (MUI) 9** | Sistema de componentes y theming |
| **Emotion** | Motor de estilos que consume MUI |
| **React Router 7** | Enrutado de la SPA (`/noticias`, `/favoritos`, …) |
| **Vite 8** | Servidor de desarrollo y empaquetado |
| **Vitest + Testing Library** | Pruebas de humo de las vistas principales |
| **Context API** | Estado global de sesión, noticias y notificaciones |
| **localStorage** | Persistencia de datos en el navegador |
| **JSON** | Datos semilla (noticias, usuarios, favoritos) |
| **Git / GitHub** | Control de versiones |

---

## 📁 Estructura del proyecto

```
notipoliweb/
├── index.html                     # Plantilla raíz de Vite (monta #root)
├── vite.config.ts                 # Configuración de Vite y de Vitest
├── tsconfig.json                  # Configuración de TypeScript (alias @/*)
├── public/
│   └── favicon.ico
├── src/
│   ├── main.tsx                   # Punto de entrada: fuentes, semillas y render
│   ├── App.tsx                    # Providers + definición de rutas
│   ├── theme.ts                   # Theme de MUI (colores y tipografía de marca)
│   ├── types.ts                   # Noticia, Usuario, Sesion, formularios…
│   ├── constants.ts               # Categorías, filtros y datos del proyecto
│   ├── App.test.tsx               # Pruebas de humo del enrutado y las vistas
│   ├── data/                      # JSON semilla importados en tiempo de compilación
│   │   ├── noticias.json
│   │   ├── usuarios.json
│   │   ├── favoritos.json
│   │   └── noticias-creadas.json
│   ├── services/                  # Lógica de datos, sin dependencias de React
│   │   ├── storage.ts             # Acceso tipado a localStorage
│   │   ├── seeds.ts               # Volcado inicial de los JSON semilla
│   │   ├── authService.ts         # Registro, login y sesión
│   │   ├── noticiasService.ts     # Noticias, favoritos e IDs
│   │   └── contactoService.ts     # Mensajes del formulario de contacto
│   ├── context/                   # Estado global
│   │   ├── AuthContext.tsx        # Sesión activa
│   │   ├── NoticiasContext.tsx    # Noticias visibles y favoritos
│   │   └── NotificacionContext.tsx# Snackbar global (sustituye a `alert()`)
│   ├── hooks/
│   │   ├── useFavorito.ts         # Regla "necesitas sesión para favoritos"
│   │   └── usePaginacion.ts       # Tramos de página para los listados
│   ├── utils/
│   │   ├── validaciones.ts        # Validadores de todos los formularios
│   │   └── fechas.ts              # Formateo de fechas en es-CO
│   ├── components/                # Piezas reutilizables
│   │   ├── Layout.tsx             # Cabecera + contenido + pie
│   │   ├── Header.tsx             # Navegación y menú "Mi cuenta"
│   │   ├── Footer.tsx
│   │   ├── NoticiaCard.tsx        # Tarjeta de noticia, rejilla y lista compacta
│   │   ├── TablaNoticias.tsx      # Tabla del CRUD, con paginación propia
│   │   ├── TarjetaAuth.tsx        # Caja "Mi cuenta" (login + registro)
│   │   ├── Paginador.tsx          # Paginador de los listados
│   │   ├── ChipCategoria.tsx
│   │   ├── Seccion.tsx            # Sección de página reutilizable
│   │   ├── EstadoVacio.tsx
│   │   ├── DialogoConfirmacion.tsx# Sustituye a `confirm()`
│   │   └── RutaProtegida.tsx      # Rutas que exigen sesión
│   ├── test/
│   │   └── setup.ts               # Configuración de jsdom para las pruebas
│   └── pages/                     # Una vista por ruta
│       ├── HomePage.tsx
│       ├── NoticiasPage.tsx
│       ├── DetallePage.tsx
│       ├── FavoritosPage.tsx
│       ├── ContactoPage.tsx
│       ├── AcercaDePage.tsx
│       ├── LoginPage.tsx
│       ├── RegistroPage.tsx
│       ├── GestionarNoticiasPage.tsx
│       └── NotFoundPage.tsx
├── mockups/                       # Wireframes de la Entrega 1
└── legacy/                        # Entrega 2 (HTML + CSS + JS vanilla)
    ├── index.html
    ├── pages/                     # Vistas HTML internas
    ├── css/ · js/ · data/         # Estilos, lógica y JSON semilla originales
    └── favicon.ico
```

---

## 🧭 Rutas de la aplicación

| Ruta | Vista | Acceso |
|------|-------|--------|
| `/` | Inicio con noticias destacadas | Público |
| `/noticias` | Listado con filtros por categoría | Público |
| `/noticias/:id` | Detalle de una noticia + relacionadas | Público |
| `/favoritos` | Mis favoritos | Requiere sesión |
| `/mis-noticias` | Redirige a `/gestionar-noticias` (ruta heredada) | Público |
| `/gestionar-noticias` | Vista unificada: crear, mis noticias y comunidad | Requiere sesión |
| `/contacto` | Formulario de contacto | Público |
| `/acerca-de` | Información y estadísticas | Público |
| `/login` · `/registro` | Autenticación | Público |
| `*` | Página no encontrada (404) | Público |

Las rutas protegidas usan el componente [`RutaProtegida`](src/components/RutaProtegida.tsx), que redirige a `/login` conservando la ruta de origen para volver allí tras iniciar sesión.

---

## 🔁 Correspondencia con la versión HTML

La migración conserva el comportamiento, los textos y la persistencia de la Entrega 2, pero reorganiza el código en componentes y servicios tipados.

| Entrega 2 (`legacy/`) | Entrega 3 (`src/`) |
|-----------------------|--------------------|
| `index.html` + `js/home.js` | `pages/HomePage.tsx` |
| `pages/noticias.html` + `js/listados.js` | `pages/NoticiasPage.tsx` |
| `pages/detalle.html` + `js/detalle.js` | `pages/DetallePage.tsx` |
| `pages/favoritos.html` + `js/favoritos.js` | `pages/FavoritosPage.tsx` |
| `pages/contacto.html` + `js/contacto.js` | `pages/ContactoPage.tsx` |
| `pages/acerca-de.html` + `js/acerca.js` | `pages/AcercaDePage.tsx` |
| `pages/login.html` + `js/auth.js` | `pages/LoginPage.tsx` |
| `pages/registro.html` + `js/auth.js` | `pages/RegistroPage.tsx` |
| `pages/gestionar-noticias.html` + `js/crud.js` | `pages/GestionarNoticiasPage.tsx` + `components/TablaNoticias.tsx` |
| `js/noticias.js` (`renderCards`, favoritos) | `components/NoticiaCard.tsx`, `context/NoticiasContext.tsx` |
| `js/app.js` (sesión, semillas, dropdown) | `services/authService.ts`, `services/seeds.ts`, `components/Header.tsx` |
| `css/styles.css` + `css/components.css` | `theme.ts` + estilos `sx` de MUI |
| `data/*.json` (fetch en runtime) | `src/data/*.json` (importados y tipados) |

### Cambios de comportamiento deliberados

- Los `alert()` y `confirm()` nativos se reemplazaron por un **Snackbar** y un **Dialog** de MUI.
- El detalle pasa de `detalle.html?id=N` a una ruta con parámetro: `/noticias/N`.
- Los estilos propios se sustituyeron por el **theme de MUI** y la prop `sx`, manteniendo la paleta original (azul `#1E3A8A`, ámbar `#F59E0B`, tipografía Poppins).
- La tipografía **Poppins** se empaqueta con `@fontsource`, sin depender de un CDN externo.

### Persistencia

Se conservan las mismas claves de `localStorage` que en la Entrega 2, por lo que **los datos guardados en la versión anterior siguen siendo válidos**:

```
notipoliweb_usuarios              notipoliweb_noticias_creadas
notipoliweb_sesion                notipoliweb_eliminadas
notipoliweb_favoritos_<email>     notipoliweb_mensajes
```

---

## 🎨 Fidelidad a los wireframes (Entrega 1)

Se revisaron los 11 wireframes de [`mockups/`](mockups/) y el diagrama de flujo de navegación contra la aplicación. Todo lo que definen está implementado:

| Wireframe | Elementos verificados |
|-----------|-----------------------|
| `menu.svg` | Cabecera con logo, 5 enlaces y desplegable **Mi cuenta ▼** |
| `01-home` | Hero + título + descripción + acciones, y 3 noticias destacadas |
| `02-listado` | Título, filtros de categoría, rejilla de tarjetas con **Ver más** y **♥** |
| `03-detalle` | Imagen, meta (categoría · fecha · autor), título, contenido, acciones y relacionadas |
| `04-contacto` | Formulario de 4 campos con validación y botón de envío |
| `05-acerca-de` | ¿Quiénes somos?, imagen del equipo y los tres pilares |
| `06-login` / `07-registro` | Card central con tabs, campos validados y enlaces cruzados |
| `08-gestionar` | Formulario de creación, tabla de noticias (Imagen · Título · Categoría · Fecha · Acciones), contador, aviso de autoría y **Bloqueado** para lo ajeno |
| `09-mis-favoritos` | Tarjetas horizontales con **Ver detalle** / **Eliminar** y ♥ |
| `10-flujo` | Condicionales de sesión y la regla de autoría (**Eliminar** vs **Bloqueado**) |

### Gestión de noticias en una sola vista

El wireframe `08` concentra la creación y la administración en una única pantalla, y así se implementó: `/gestionar-noticias` muestra en dos columnas el formulario de creación (izquierda) y, a la derecha, **Mis noticias publicadas** (con la acción **Eliminar**) seguido de **Otras noticias de la comunidad** (solo lectura).

El diagrama de flujo (`10`) listaba *Mis noticias* y *Gestionar noticias* como dos entradas del menú privado. Al unificar ambas funcionalidades en una sola vista, el menú conserva únicamente **Gestionar noticias** para no ofrecer dos destinos al mismo contenido. La ruta antigua `/mis-noticias` redirige a la nueva para no romper enlaces.

Toda la tabla del wireframe se resuelve con el componente reutilizable [`TablaNoticias`](src/components/TablaNoticias.tsx).

### Listados paginados

Para que las vistas no crezcan indefinidamente hacia abajo, tres listados se paginan con el hook [`usePaginacion`](src/hooks/usePaginacion.ts) y el componente [`Paginador`](src/components/Paginador.tsx):

| Vista | Tamaño de página |
|-------|------------------|
| Noticias (rejilla) | 6 por página |
| Mis favoritos | 5 por página |
| Gestión de noticias (cada tabla) | 5 filas por página |

Los tamaños se ajustan en un solo sitio, `TAMANO_PAGINA` dentro de [`src/constants.ts`](src/constants.ts). El paginador se oculta cuando solo hay una página y vuelve al principio al cambiar de categoría; además retrocede solo si la lista se acorta tras eliminar una noticia.

### Caja "Mi cuenta" compartida

Las vistas de inicio de sesión y registro comparten la tarjeta [`TarjetaAuth`](src/components/TarjetaAuth.tsx), que reúne las dos pestañas (**Iniciar sesión** / **Registrarse**) con sus formularios validados. Al vivir en un único componente, la lógica de validación y alta de usuario no está duplicada: `LoginPage` y `RegistroPage` solo aportan la ruta de destino tras autenticarse.

Los símbolos que los wireframes dibujan dentro de los encabezados y estados (`➕`, `📄`, `📰`) se sustituyeron por **iconos de Material UI**, para que toda la interfaz use un único lenguaje visual en lugar de mezclar emoji con iconos. Los elementos que ya venían resueltos con iconos (`🗑 Eliminar`, `🔒 Bloqueado`, `👤 Mi cuenta`, `♥`) se mantienen con su equivalente de MUI.

### Añadidos posteriores a los wireframes

Estos elementos no aparecen en los mockups y se conservan de forma deliberada, porque aportan valor y ya formaban parte de la Entrega 2:

- **Inicio:** sección de testimonios.
- **Acerca de:** estadísticas dinámicas y llamada a la acción final.
- **Listado:** filtro adicional **Comerciales**, necesario para que las noticias de esa categoría sean accesibles desde los filtros.
- **Detalle:** botón **Eliminar noticia** para el autor y enlace de vuelta al listado.
- **Registro:** campo de confirmación de contraseña (la validación exige un mínimo de 6 caracteres).

---

## ✅ Pruebas

```bash
npm test
```

La suite cubre el renderizado del inicio, el listado y sus filtros, la protección de rutas, el detalle con relacionadas y la página 404.

---

## 👥 Autoría

Proyecto académico del módulo **Desarrollo de Front-end**.
Repositorio: https://github.com/Cronos186/NotiPoliWeb
