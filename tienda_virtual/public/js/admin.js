// tienda_virtual/public/js/admin.js
const API_BASE = (window.API_BASE && window.API_BASE.trim()) ? window.API_BASE : '/api';
const API_USERS = `${API_BASE}/usuarios`;

function esc(s='') {
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[ch]));
}

async function cargarUsuarios() {
  try {
    const r = await fetch(API_USERS);
    if (!r.ok) throw new Error('API ' + r.status);
    const users = await r.json();
    const tbody = document.querySelector('#tablaUsuarios tbody');
    tbody.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${esc(u.nombre)}</td>
        <td>${esc(u.correo)}</td>
        <td>${esc(u.rol || '')}</td>
        <td>
          <button class="btn btn-sm btn-primary btn-editar" data-id="${u.id}">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar" data-id="${u.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // handlers
    document.querySelectorAll('.btn-editar').forEach(b => b.addEventListener('click', () => abrirEditar(b.dataset.id)));
    document.querySelectorAll('.btn-eliminar').forEach(b => b.addEventListener('click', () => eliminarUsuario(b.dataset.id)));
  } catch (err) {
    console.error('Error cargarUsuarios', err);
    alert('Error cargando usuarios: ' + (err.message || err));
  }
}

function abrirNuevo() {
  document.getElementById('tituloModal').innerText = 'Nuevo Usuario';
  document.getElementById('usuarioId').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('correo').value = '';
  document.getElementById('password').value = '';
  document.getElementById('rol').value = 'cliente';
  const modalEl = document.getElementById('modalUsuario');
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
  modalEl._bsInstance = modal;
}

async function abrirEditar(id) {
  try {
    const r = await fetch(`${API_USERS}/${id}`);
    if (r.status === 404) { alert('Usuario no encontrado'); return; }
    if (!r.ok) throw new Error('API ' + r.status);
    const user = await r.json();
    document.getElementById('tituloModal').innerText = 'Editar Usuario';
    document.getElementById('usuarioId').value = user.id;
    document.getElementById('nombre').value = user.nombre || '';
    document.getElementById('correo').value = user.correo || '';
    document.getElementById('password').value = '';
    document.getElementById('rol').value = user.rol || 'cliente';
    const modalEl = document.getElementById('modalUsuario');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    modalEl._bsInstance = modal;
  } catch (err) {
    console.error('Error abrirEditar', err);
    alert('Error cargando usuario: ' + (err.message || err));
  }
}

async function eliminarUsuario(id) {
  if (!confirm(`¿Eliminar usuario #${id}?`)) return;
  try {
    const r = await fetch(`${API_USERS}/${id}`, { method: 'DELETE' });
    const txt = await r.text().catch(()=>'');
    if (!r.ok) {
      let payload;
      try { payload = JSON.parse(txt); } catch(e) { payload = { error: txt }; }
      alert(payload.error || 'Error eliminando usuario');
      return;
    }
    alert('Usuario eliminado');
    cargarUsuarios();
  } catch (err) {
    console.error('Error eliminarUsuario', err);
    alert('Error eliminando: ' + (err.message || err));
  }
}

// submit del formulario modal
document.addEventListener('DOMContentLoaded', () => {
  // cargar inicialmente
  cargarUsuarios();

  // nuevo
  document.getElementById('btnAbrirNuevo').addEventListener('click', abrirNuevo);

  // manejar submit
  document.getElementById('formUsuario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('usuarioId').value;
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const rol = document.getElementById('rol').value;

    if (!nombre || !correo) { alert('Nombre y correo son obligatorios'); return; }

    const payload = { nombre, correo, rol };
    if (password && password.trim() !== '') payload.password = password;

    try {
      let r;
      if (id && id !== '') {
        r = await fetch(`${API_USERS}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        if (!password) { alert('Contraseña requerida para nuevo usuario'); return; }
        r = await fetch(API_USERS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const txt = await r.text().catch(()=>'');
      if (!r.ok) {
        let payloadErr;
        try { payloadErr = JSON.parse(txt); } catch(e) { payloadErr = { error: txt }; }
        alert(payloadErr.error || 'Error en la API');
        return;
      }

      // cerrar modal
      const modalEl = document.getElementById('modalUsuario');
      if (modalEl && modalEl._bsInstance) modalEl._bsInstance.hide();
      // recargar
      cargarUsuarios();
    } catch (err) {
      console.error('Error submit formUsuario', err);
      alert('Error guardando usuario: ' + (err.message || err));
    }
  });
});
