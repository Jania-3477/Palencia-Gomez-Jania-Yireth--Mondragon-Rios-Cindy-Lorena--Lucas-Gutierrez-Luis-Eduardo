// public/js/usuarios.js
const API_USERS = `${window.API_BASE}/usuarios`;

function showAlert(msg, type = "success") {
  const exist = document.getElementById("top-alert");
  if (exist) exist.remove();
  const div = document.createElement("div");
  div.id = "top-alert";
  div.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
  div.style.zIndex = 1060;
  div.innerText = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}
function handleError(e) {
  console.error(e);
  showAlert("Error: " + (e.message || "algo salió mal"), "danger");
}
function escapeHtml(s = "") {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

const modalEl = document.getElementById("userModal");
const bsModal = new bootstrap.Modal(modalEl);
const form = document.getElementById("userForm");
const tbody = document.getElementById("users-body");
const btnNew = document.getElementById("btnNew");
const modalTitle = document.getElementById("modalTitle");

async function cargarUsuarios() {
  try {
    const res = await fetch(API_USERS);
    if (!res.ok) throw new Error(`API ${res.status}`);
    const usuarios = await res.json();
    tbody.innerHTML = "";
    usuarios.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${escapeHtml(u.nombre)}</td>
        <td>${escapeHtml(u.correo)}</td>
        <td>${escapeHtml(u.rol || '')}</td>
        <td>
          <button class="btn btn-sm btn-warning editar" data-id="${u.id}" data-nombre="${escapeHtml(u.nombre)}" data-correo="${escapeHtml(u.correo)}">Editar</button>
          <button class="btn btn-sm btn-danger eliminar" data-id="${u.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".editar").forEach(b => {
      b.onclick = () => abrirModalEditar(b.dataset.id, b.dataset.nombre, b.dataset.correo);
    });
    document.querySelectorAll(".eliminar").forEach(b => {
      b.onclick = async () => {
        const id = b.dataset.id;
        if (!confirm(`¿Eliminar usuario #${id}?`)) return;
        try {
          const r = await fetch(`${API_USERS}/${id}`, { method: "DELETE" });
          if (!r.ok) throw new Error(`API ${r.status}`);
          showAlert("Usuario eliminado");
          cargarUsuarios();
        } catch (e) { handleError(e); }
      };
    });

  } catch (e) { handleError(e); }
}

btnNew.addEventListener("click", () => {
  modalTitle.textContent = "Nuevo Usuario";
  form.reset();
  document.getElementById("userId").value = "";
  bsModal.show();
});

function abrirModalEditar(id, nombre, correo) {
  modalTitle.textContent = "Editar Usuario";
  document.getElementById("userId").value = id;
  document.getElementById("userNombre").value = nombre;
  document.getElementById("userEmail").value = correo;
  document.getElementById("userPassword").value = "";
  bsModal.show();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("userId").value;
  const nombre = document.getElementById("userNombre").value.trim();
  const correo = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value;

  if (!nombre || !correo) {
    showAlert("Nombre y correo son obligatorios", "warning");
    return;
  }

  const payload = { nombre, correo };
  if (password) payload.password = password;

  try {
    let res;
    if (id) {
      res = await fetch(`${API_USERS}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      if (!password) { showAlert("Contraseña requerida para nuevo usuario", "warning"); return; }
      payload.rol = "cliente";
      res = await fetch(API_USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }
    if (!res.ok) {
      const text = await res.text().catch(()=>"");
      throw new Error(`API ${res.status} ${text}`);
    }
    bsModal.hide();
    showAlert(id ? "Usuario actualizado" : "Usuario creado");
    cargarUsuarios();
  } catch (err) { handleError(err); }
});

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});
