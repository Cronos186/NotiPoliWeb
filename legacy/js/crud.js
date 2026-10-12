/* ============================================================
   NotiPoliWeb — crud.js
   Mini CRUD: crear noticias + eliminar las propias
   ============================================================ */

/* ---------- VERIFICAR SESIÓN ---------- */
function verificarSesionCRUD() {
  const sesion = getSesion();
  if (!sesion) {
    alert('Debes iniciar sesión para gestionar noticias.');
    window.location.href = 'login.html';
    return null;
  }
  return sesion;
}

/* ---------- VALIDACIONES ---------- */
function validarTitulo(valor) {
  if (!valor.trim()) return 'El título es obligatorio.';
  if (valor.trim().length < 5) return 'El título debe tener al menos 5 caracteres.';
  return '';
}

function validarCategoria(valor) {
  if (!valor) return 'Debes seleccionar una categoría.';
  return '';
}

function validarImagen(valor) {
  if (!valor.trim()) return 'La URL de la imagen es obligatoria.';
  try {
    new URL(valor.trim());
  } catch {
    return 'Ingresa una URL válida (ej: https://...).';
  }
  return '';
}

function validarDescripcion(valor) {
  if (!valor.trim()) return 'La descripción es obligatoria.';
  if (valor.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres.';
  if (valor.trim().length > 150) return 'La descripción no puede superar los 150 caracteres.';
  return '';
}

function validarContenido(valor) {
  if (!valor.trim()) return 'El contenido es obligatorio.';
  if (valor.trim().length < 30) return 'El contenido debe tener al menos 30 caracteres.';
  return '';
}

/* ---------- MOSTRAR ERRORES ---------- */
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

/* ---------- CREAR NOTICIA ---------- */
function initFormularioCRUD() {
  const form = document.getElementById('crudForm');
  if (!form) return;

  const sesion = getSesion();
  document.getElementById('autorNombre').textContent =
    `${sesion.nombre} ${sesion.apellido || ''}`.trim();

  const campos = ['titulo', 'categoria', 'imagen', 'descripcion', 'contenido'];
  const validadores = {
    titulo: validarTitulo,
    categoria: validarCategoria,
    imagen: validarImagen,
    descripcion: validarDescripcion,
    contenido: validarContenido
  };

  // Validación en tiempo real (blur)
  campos.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => {
      mostrarError(id, validadores[id](input.value));
    });
    input.addEventListener('input', () => mostrarError(id, ''));
  });

  // Envío
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const successBox = document.getElementById('crudSuccess');
    const errorBox = document.getElementById('crudError');
    successBox.style.display = 'none';
    errorBox.style.display = 'none';

    const valores = {};
    campos.forEach(id => {
      valores[id] = document.getElementById(id).value;
      mostrarError(id, validadores[id](valores[id]));
    });

    const hayErrores = campos.some(id => validadores[id](valores[id]));
    if (hayErrores) {
      const primerError = document.querySelector('.form__input--error');
      if (primerError) primerError.focus();
      return;
    }

    // Crear objeto noticia
    const nuevaNoticia = {
      id: getSiguienteId(),
      titulo: valores.titulo.trim(),
      categoria: valores.categoria,
      imagen: valores.imagen.trim(),
      descripcion: valores.descripcion.trim(),
      contenido: valores.contenido.trim(),
      fecha: new Date().toISOString().split('T')[0],
      autorEmail: sesion.email,
      autorNombre: `${sesion.nombre} ${sesion.apellido || ''}`.trim()
    };

    // Guardar en localStorage
    const creadas = JSON.parse(localStorage.getItem('notipoliweb_noticias_creadas') || '[]');
    creadas.push(nuevaNoticia);
    localStorage.setItem('notipoliweb_noticias_creadas', JSON.stringify(creadas));

    // Actualizar caché
    noticiasCache.push(nuevaNoticia);

    // Mensaje de éxito
    successBox.textContent = `✅ Noticia "${nuevaNoticia.titulo}" publicada correctamente.`;
    successBox.style.display = 'block';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Reset y re-render
    form.reset();
    renderMisNoticias();
    renderOtrasNoticias();

    setTimeout(() => { successBox.style.display = 'none'; }, 5000);
  });

  // Botón limpiar
  document.getElementById('btnLimpiar').addEventListener('click', () => {
    form.reset();
    campos.forEach(id => mostrarError(id, ''));
  });
}

/* ---------- RENDER: MIS NOTICIAS ---------- */
function renderMisNoticias() {
  const sesion = getSesion();
  const tbody = document.getElementById('misNoticiasBody');
  const empty = document.getElementById('misNoticiasEmpty');
  const count = document.getElementById('misNoticiasCount');
  if (!tbody) return;

  const misNoticias = noticiasCache.filter(n => n.autorEmail === sesion.email);
  count.textContent = `(${misNoticias.length})`;

  if (misNoticias.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  tbody.innerHTML = misNoticias.map(n => `
    <tr>
      <td><img src="${n.imagen}" alt="${n.titulo}" class="crud__thumb"></td>
      <td class="crud__td-titulo">${n.titulo}</td>
      <td><span class="card__categoria">${n.categoria}</span></td>
      <td>${formatearFechaCorta(n.fecha)}</td>
      <td>
        <button class="btn btn--danger-outline btn--sm"
                onclick="eliminarNoticiaCRUD(${n.id})">
          🗑 Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

/* ---------- RENDER: OTRAS NOTICIAS ---------- */
function renderOtrasNoticias() {
  const sesion = getSesion();
  const tbody = document.getElementById('otrosNoticiasBody');
  if (!tbody) return;

  const otras = noticiasCache.filter(n => n.autorEmail !== sesion.email);

  if (otras.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="crud__td-empty">
          No hay noticias de otros autores por ahora.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = otras.map(n => `
    <tr>
      <td><img src="${n.imagen}" alt="${n.titulo}" class="crud__thumb"></td>
      <td class="crud__td-titulo">${n.titulo}</td>
      <td><span class="card__categoria">${n.categoria}</span></td>
      <td>${formatearFechaCorta(n.fecha)}</td>
      <td>
        <button class="btn btn--locked btn--sm" disabled title="No puedes eliminar noticias de otros autores">
          🔒 Bloqueado
        </button>
      </td>
    </tr>
  `).join('');
}

/* ---------- ELIMINAR NOTICIA (SOLO AUTOR) ---------- */
function eliminarNoticiaCRUD(id) {
  const sesion = getSesion();
  if (!sesion) return;

  const noticia = noticiasCache.find(n => n.id === id);
  if (!noticia) return;

  // Verificación de autoría (doble chequeo)
  if (noticia.autorEmail !== sesion.email) {
    alert('❌ No puedes eliminar noticias de otros autores.');
    return;
  }

  const confirmar = confirm(`¿Eliminar la noticia "${noticia.titulo}"?`);
  if (!confirmar) return;

  // Registrar en eliminadas
  const eliminadas = JSON.parse(localStorage.getItem('notipoliweb_eliminadas') || '[]');
  eliminadas.push(id);
  localStorage.setItem('notipoliweb_eliminadas', JSON.stringify(eliminadas));

  // Si fue creada por el usuario, la quitamos de noticias_creadas
  const creadas = JSON.parse(localStorage.getItem('notipoliweb_noticias_creadas') || '[]');
  const creadasFiltradas = creadas.filter(n => n.id !== id);
  localStorage.setItem('notipoliweb_noticias_creadas', JSON.stringify(creadasFiltradas));

  // Actualizar caché
  noticiasCache = noticiasCache.filter(n => n.id !== id);

  // Re-render
  renderMisNoticias();
  renderOtrasNoticias();

  // Mensaje
  const successBox = document.getElementById('crudSuccess');
  successBox.textContent = `🗑 Noticia "${noticia.titulo}" eliminada correctamente.`;
  successBox.style.display = 'block';
  setTimeout(() => { successBox.style.display = 'none'; }, 5000);
}

/* ---------- FORMATEAR FECHA CORTA ---------- */
function formatearFechaCorta(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/* ---------- INICIALIZACIÓN ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  const sesion = verificarSesionCRUD();
  if (!sesion) return;

  await cargarNoticias();
  initFormularioCRUD();
  renderMisNoticias();
  renderOtrasNoticias();
});