/* ============================================================
   NotiPoliWeb — app.js
   Funciones globales: sesión, dropdown, semillas, utilidades
   ============================================================ */

/* ==================== CONSTANTES ==================== */
const STORAGE_KEYS = {
  USUARIOS: 'notipoliweb_usuarios',
  SESION: 'notipoliweb_sesion',
  FAVORITOS: (email) => `notipoliweb_favoritos_${email}`,
  NOTICIAS_CREADAS: 'notipoliweb_noticias_creadas',
  ELIMINADAS: 'notipoliweb_eliminadas',
  MENSAJES: 'notipoliweb_mensajes'
};

/* ==================== SESIÓN ==================== */
function getSesion() {
  const raw = localStorage.getItem(STORAGE_KEYS.SESION);
  return raw ? JSON.parse(raw) : null;
}

function setSesion(usuario) {
  localStorage.setItem(STORAGE_KEYS.SESION, JSON.stringify(usuario));
}

function cerrarSesion() {
  localStorage.removeItem(STORAGE_KEYS.SESION);
  window.location.href = getBasePath() + 'index.html';
}

/* ==================== UTILIDADES ==================== */
function getBasePath() {
  // Detecta si estamos en /pages/ para ajustar rutas relativas
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ==================== DROPDOWN MI CUENTA ==================== */
function renderAccountMenu() {
  const menu = document.getElementById('accountMenu');
  const label = document.getElementById('accountLabel');
  if (!menu || !label) return;

  const sesion = getSesion();
  const base = getBasePath();

  if (sesion) {
    label.textContent = sesion.nombre;
    menu.innerHTML = `
      <div class="user-name">${sesion.nombre} ${sesion.apellido || ''}</div>
      <a href="${base}pages/gestionar-noticias.html">➜ Mis noticias</a>
      <a href="${base}pages/gestionar-noticias.html">➜ Gestionar noticias</a>
      <a href="${base}pages/favoritos.html">➜ Mis favoritos</a>
      <hr>
      <button onclick="cerrarSesion()">➜ Cerrar sesión</button>
    `;
  } else {
    label.textContent = 'Mi cuenta';
    menu.innerHTML = `
      <a href="${base}pages/login.html">➜ Iniciar sesión</a>
      <a href="${base}pages/registro.html">➜ Registrarse</a>
    `;
  }
}

function initAccountDropdown() {
  const btn = document.getElementById('accountBtn');
  const menu = document.getElementById('accountMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('active');
  });
}

/* ============================================================
   CARGA DE SEMILLAS (usuarios, favoritos, noticias creadas)
   ============================================================ */

/* ---------- USUARIOS ---------- */
async function cargarUsuariosSemilla() {
  // Si ya hay usuarios en localStorage, no sobreescribir
  const existentes = localStorage.getItem(STORAGE_KEYS.USUARIOS);
  if (existentes && JSON.parse(existentes).length > 0) return;

  try {
    const base = getBasePath();
    const res = await fetch(base + 'data/usuarios.json');
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(data.usuarios));
    console.log('✅ Usuarios semilla cargados:', data.usuarios.length);
  } catch (err) {
    console.warn('⚠ No se pudieron cargar usuarios semilla:', err);
  }
}

/* ---------- FAVORITOS ---------- */
async function cargarFavoritosSemilla() {
  try {
    const base = getBasePath();
    const res = await fetch(base + 'data/favoritos.json');
    const data = await res.json();

    // Para cada usuario, si no tiene favoritos en localStorage, los cargamos
    data.favoritos.forEach(f => {
      const clave = STORAGE_KEYS.FAVORITOS(f.email);
      if (!localStorage.getItem(clave)) {
        localStorage.setItem(clave, JSON.stringify(f.noticias));
      }
    });
    console.log('✅ Favoritos semilla cargados');
  } catch (err) {
    console.warn('⚠ No se pudieron cargar favoritos semilla:', err);
  }
}

/* ---------- NOTICIAS CREADAS ---------- */
async function cargarNoticiasCreadasSemilla() {
  const existentes = localStorage.getItem(STORAGE_KEYS.NOTICIAS_CREADAS);
  if (existentes && JSON.parse(existentes).length > 0) return;

  try {
    const base = getBasePath();
    const res = await fetch(base + 'data/noticias-creadas.json');
    const data = await res.json();
    localStorage.setItem(STORAGE_KEYS.NOTICIAS_CREADAS, JSON.stringify(data.noticias));
    console.log('✅ Noticias creadas semilla cargadas:', data.noticias.length);
  } catch (err) {
    console.warn('⚠ No se pudieron cargar noticias creadas semilla:', err);
  }
}

/* ---------- CARGA GLOBAL DE SEMILLAS ---------- */
async function cargarSemillas() {
  await Promise.all([
    cargarUsuariosSemilla(),
    cargarFavoritosSemilla(),
    cargarNoticiasCreadasSemilla()
  ]);
}

/* ==================== INICIALIZACIÓN ==================== */
document.addEventListener('DOMContentLoaded', async () => {
  await cargarSemillas();
  renderAccountMenu();
  initAccountDropdown();
});