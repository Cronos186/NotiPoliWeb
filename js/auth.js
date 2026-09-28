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

/* ============================================================
   REGISTRO
   ============================================================ */

/* ---------- VALIDACIONES ESPECÍFICAS DEL REGISTRO ---------- */
function validarNombre(valor) {
  if (!valor.trim()) return 'El nombre es obligatorio.';
  if (valor.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
  return '';
}

function validarApellido(valor) {
  if (!valor.trim()) return 'El apellido es obligatorio.';
  if (valor.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.';
  return '';
}

function validarCorreoUnico(valor) {
  const err = validarCorreo(valor);
  if (err) return err;
  const existente = buscarUsuario(valor.trim());
  if (existente) return 'Ya existe una cuenta con este correo.';
  return '';
}

function validarPassword2(valor, original) {
  if (!valor) return 'Debes confirmar la contraseña.';
  if (valor !== original) return 'Las contraseñas no coinciden.';
  return '';
}

function validarTerminos(checked) {
  if (!checked) return 'Debes aceptar los términos y condiciones.';
  return '';
}

/* ---------- TOGGLE CONTRASEÑA (segundo input) ---------- */
function initTogglePassword2() {
  const btn = document.getElementById('togglePassword2');
  const input = document.getElementById('password2');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const esPassword = input.type === 'password';
    input.type = esPassword ? 'text' : 'password';
    btn.textContent = esPassword ? '🙈' : '👁';
  });
}

/* ---------- REGISTRO ---------- */
function initRegistro() {
  const form = document.getElementById('registroForm');
  if (!form) return;

  // Referencias
  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const correo = document.getElementById('correo');
  const password = document.getElementById('password');
  const password2 = document.getElementById('password2');
  const terminos = document.getElementById('terminos');

  // Validación en tiempo real (blur)
  nombre.addEventListener('blur', () => mostrarError('nombre', validarNombre(nombre.value)));
  apellido.addEventListener('blur', () => mostrarError('apellido', validarApellido(apellido.value)));
  correo.addEventListener('blur', () => mostrarError('correo', validarCorreoUnico(correo.value)));
  password.addEventListener('blur', () => mostrarError('password', validarPassword(password.value)));
  password2.addEventListener('blur', () =>
    mostrarError('password2', validarPassword2(password2.value, password.value)));
  terminos.addEventListener('change', () =>
    mostrarError('terminos', validarTerminos(terminos.checked)));

  // Limpiar errores al escribir
  [nombre, apellido, correo, password, password2].forEach(input => {
    input.addEventListener('input', () => mostrarError(input.id, ''));
  });

  // Envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const errorBox = document.getElementById('registroError');
    errorBox.style.display = 'none';

    const errNombre = validarNombre(nombre.value);
    const errApellido = validarApellido(apellido.value);
    const errCorreo = validarCorreoUnico(correo.value);
    const errPassword = validarPassword(password.value);
    const errPassword2 = validarPassword2(password2.value, password.value);
    const errTerminos = validarTerminos(terminos.checked);

    mostrarError('nombre', errNombre);
    mostrarError('apellido', errApellido);
    mostrarError('correo', errCorreo);
    mostrarError('password', errPassword);
    mostrarError('password2', errPassword2);
    mostrarError('terminos', errTerminos);

    if (errNombre || errApellido || errCorreo || errPassword || errPassword2 || errTerminos) {
      const primerError = document.querySelector('.form__input--error, .auth__checkbox--error');
      if (primerError) primerError.focus();
      return;
    }

    // Crear usuario
    const nuevoUsuario = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: correo.value.trim().toLowerCase(),
      password: password.value,
      fechaRegistro: new Date().toISOString()
    };

    const usuarios = getUsuarios();
    usuarios.push(nuevoUsuario);
    setUsuarios(usuarios);

    // Auto-login tras registro
    const btn = document.getElementById('btnRegistro');
    btn.disabled = true;
    btn.textContent = 'Creando cuenta...';

    setTimeout(() => {
      setSesion({
        email: nuevoUsuario.email,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido
      });
      window.location.href = 'favoritos.html';
    }, 700);
  });
}

/* ---------- ACTUALIZAR INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Login
  if (document.getElementById('loginForm')) {
    initTogglePassword();
    initLogin();
  }
  // Registro
  if (document.getElementById('registroForm')) {
    initTogglePassword();
    initTogglePassword2();
    initRegistro();
  }
});