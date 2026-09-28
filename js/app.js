/* ============================================================
   NotiPoliWeb — app.js
   Funciones globales: header, dropdown, sesión, utilidades
   ============================================================ */

const STORAGE_KEYS = {
  USUARIOS: 'notipoliweb_usuarios',
  SESION: 'notipoliweb_sesion',
  FAVORITOS: (email) => `notipoliweb_favoritos_${email}`
};

/* ---------- SESIÓN ---------- */
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

/* ---------- UTILIDADES ---------- */
function getBasePath() {
  // Detecta si estamos en /pages/ para ajustar rutas relativas
  return window.location.pathname.includes('/pages/') ? '../' : './';
}

/* ---------- DROPDOWN MI CUENTA ---------- */
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

/* ---------- TOGGLE DEL DROPDOWN ---------- */
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

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderAccountMenu();
  initAccountDropdown();
});