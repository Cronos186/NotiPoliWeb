/* ============================================================
   NotiPoliWeb — contacto.js
   Validaciones del formulario de contacto y confirmación
   ============================================================ */

/* ---------- UTILIDADES DE VALIDACIÓN ---------- */
function validarNombre(valor) {
  if (!valor.trim()) return 'El nombre es obligatorio.';
  if (valor.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres.';
  return '';
}

function validarCorreo(valor) {
  if (!valor.trim()) return 'El correo es obligatorio.';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(valor.trim())) return 'Ingresa un correo válido (ej: tu@correo.com).';
  return '';
}

function validarMensaje(valor) {
  if (!valor.trim()) return 'El mensaje es obligatorio.';
  if (valor.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
  return '';
}

/* ---------- MOSTRAR / LIMPIAR ERRORES ---------- */
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

/* ---------- VALIDACIÓN EN TIEMPO REAL ---------- */
function initValidaciones() {
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const mensaje = document.getElementById('mensaje');

  nombre.addEventListener('blur', () => {
    mostrarError('nombre', validarNombre(nombre.value));
  });
  correo.addEventListener('blur', () => {
    mostrarError('correo', validarCorreo(correo.value));
  });
  mensaje.addEventListener('blur', () => {
    mostrarError('mensaje', validarMensaje(mensaje.value));
  });

  // Limpiar error mientras el usuario escribe
  [nombre, correo, mensaje].forEach(input => {
    input.addEventListener('input', () => {
      mostrarError(input.id, '');
    });
  });
}

/* ---------- ENVÍO DEL FORMULARIO ---------- */
function initFormulario() {
  const form = document.getElementById('contactoForm');
  const successMsg = document.getElementById('successMessage');
  const btn = document.getElementById('btnEnviar');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const asunto = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value;

    // Ejecutar todas las validaciones
    const errNombre = validarNombre(nombre);
    const errCorreo = validarCorreo(correo);
    const errMensaje = validarMensaje(mensaje);

    mostrarError('nombre', errNombre);
    mostrarError('correo', errCorreo);
    mostrarError('mensaje', errMensaje);

    // Si hay errores, detener
    if (errNombre || errCorreo || errMensaje) {
      const primerError = document.querySelector('.form__input--error');
      if (primerError) primerError.focus();
      return;
    }

    // Simular envío (deshabilitar botón brevemente)
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    setTimeout(() => {
      // Guardar mensaje en localStorage (registro local)
      const mensajes = JSON.parse(localStorage.getItem('notipoliweb_mensajes') || '[]');
      mensajes.push({
        nombre: nombre.trim(),
        correo: correo.trim(),
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
        fecha: new Date().toISOString()
      });
      localStorage.setItem('notipoliweb_mensajes', JSON.stringify(mensajes));

      // Mostrar mensaje de éxito
      successMsg.style.display = 'block';
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Reset del formulario
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Enviar Mensaje';

      // Ocultar mensaje de éxito después de 6 segundos
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 6000);
    }, 800);
  });
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initValidaciones();
  initFormulario();
});