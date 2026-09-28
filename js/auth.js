/* ============================================================
   NotiPoliWeb — auth.js
   Login, registro y gestión de sesión con localStorage
   ============================================================ */

/* ---------- UTILIDADES ---------- */
function getUsuarios() {
  const raw = localStorage.getItem('notipoliweb_usuarios');
  return raw ? JSON.parse(raw) : [];
}

function setUsuarios(lista) {
  localStorage.setItem('notipoliweb_usuarios', JSON.stringify(lista));
}

function buscarUsuario(email) {
  return getUsuarios().find(u => u.email.toLowerCase() === email.toLowerCase());
}

/* ---------- VALIDACIONES ---------- */
function validarCorreo(valor) {
  if (!valor.trim()) return 'El correo es obligatorio.';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(valor.trim())) return 'Ingresa un correo válido.';
  return '';
}

function validarPassword(valor) {
  if (!valor) return 'La contraseña es obligatoria.';
  if (valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  return '';
}

function mostrarError(campoId, mensaje) {
  const errorEl = document.getElementById('error' + capitalizar(campoId));
  const inputEl = document.getElementById(campoId);
  if (errorEl) errorEl.textContent = mensaje;
  if (inputEl) {
    if (mensaje) inputEl.classList.add('form__input--error');
    else inputEl.classList.remove('form__input--error');
  }
}

function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ---------- MOSTRAR / OCULTAR CONTRASEÑA ---------- */
function initTogglePassword() {
  const btn = document.getElementById('togglePassword');
  const input = document.getElementById('password');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const esPassword = input.type === 'password';
    input.type = esPassword ? 'text' : 'password';
    btn.textContent = esPassword ? '🙈' : '👁';
  });
}

/* ---------- LOGIN ---------- */
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // Validación en tiempo real
  const correo = document.getElementById('correo');
  const password = document.getElementById('password');

  correo.addEventListener('blur', () => mostrarError('correo', validarCorreo(correo.value)));
  password.addEventListener('blur', () => mostrarError('password', validarPassword(password.value)));

  [correo, password].forEach(input => {
    input.addEventListener('input', () => mostrarError(input.id, ''));
  });

  // Envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const errorBox = document.getElementById('loginError');
    errorBox.style.display = 'none';

    const errCorreo = validarCorreo(correo.value);
    const errPassword = validarPassword(password.value);

    mostrarError('correo', errCorreo);
    mostrarError('password', errPassword);

    if (errCorreo || errPassword) return;

    const usuario = buscarUsuario(correo.value.trim());

    if (!usuario) {
      errorBox.textContent = '❌ No existe una cuenta con ese correo.';
      errorBox.style.display = 'block';
      return;
    }

    if (usuario.password !== password.value) {
      errorBox.textContent = '❌ Contraseña incorrecta. Inténtalo de nuevo.';
      errorBox.style.display = 'block';
      return;
    }

    // Login exitoso
    const btn = document.getElementById('btnLogin');
    btn.disabled = true;
    btn.textContent = 'Iniciando sesión...';

    setTimeout(() => {
      setSesion({
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      });
      window.location.href = 'favoritos.html';
    }, 600);
  });
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initTogglePassword();
  initLogin();
});