# 📰 NotiPoliWeb

Aplicación web tipo periódico digital desarrollada como proyecto del módulo **Desarrollo de Front-end**. Permite a los usuarios explorar noticias, guardar favoritos, publicar sus propias experiencias y gestionar su cuenta.

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

## 🚀 Demo

- **Repositorio:** https://github.com/Cronos186/NotiPoliWeb
- **Demo en vivo:** (pendiente — se despliega en la Entrega 3)

---

## 🛠 Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| **HTML5** | Estructura semántica |
| **CSS3** | Estilos, layout responsive, componentes |
| **JavaScript (ES6+)** | Lógica de la aplicación, interactividad |
| **JSON** | Datos semilla (noticias, usuarios, favoritos) |
| **localStorage** | Persistencia de datos en el navegador |
| **Git / GitHub** | Control de versiones |
| **GitHub Pages / Netlify** | Despliegue (pendiente) |

> **Entrega 3:** migración a **Angular** con componentes y servicios.

---

## 📁 Estructura del proyecto

```
notipoliweb/
├── index.html                    # Home
├── README.md
├── pages/
│   ├── noticias.html             # Listado de noticias
│   ├── detalle.html              # Detalle de una noticia
│   ├── contacto.html             # Formulario de contacto
│   ├── acerca-de.html            # Información del proyecto
│   ├── login.html                # Iniciar sesión
│   ├── registro.html             # Crear cuenta
│   ├── favoritos.html            # Mis favoritos
│   └── gestionar-noticias.html   # Mini CRUD
├── css/
│   ├── styles.css                # Estilos globales (header, footer, hero)
│   ├── components.css            # Componentes reutilizables (cards, botones)
│   └── pages.css                 # Estilos específicos de vistas internas
├── js/
│   ├── app.js                    # Funciones globales, sesión, semillas
│   ├── noticias.js               # Carga y render de noticias + favoritos
│   ├── listado.js                # Filtros y render del listado
│   ├── detalle.js                # Render del detalle + eliminar
│   ├── contacto.js               # Validaciones del formulario
│   ├── acerca.js                 # Estadísticas dinámicas
│   ├── auth.js                   # Login, registro y sesión
│   ├── favoritos.js              # Vista "Mis Favoritos"
│   └── crud.js                   # Mini CRUD (crear / eliminar)
├── data/
│   ├── noticias.json             # Noticias base (semilla)
│   ├── usuarios.json             # Usuarios semilla
│   ├── favoritos.json            # Favoritos semilla por usuario
│   └── noticias-creadas.json     # Noticias creadas por usuarios (semilla)
├── assets/
│   ├── img/                      # Imágenes propias
│   └── icons/                    # Íconos
├── mockups/                      # De la Entrega 1
└── docs/                         # Documentación y PDFs
```

### Descripción de carpetas

| Carpeta | Contenido |
|---------|-----------|
| `pages/` | Vistas HTML internas del aplicativo |
| `css/` | Hojas de estilo (global, componentes y páginas) |
| `js/` | Lógica JavaScript organizada por responsabilidad |
| `data/` | Archivos JSON semilla (noticias, usuarios, favoritos, creadas) |
| `assets/` | Recursos estáticos (imágenes, íconos) |
| `mockups/` | Wireframes SVG de la Entrega 1 |
| `docs/` | Documentación y PDFs de las entregas |
