// tienda_virtual/public/js/app.js
const API_BASE = (window.API_BASE && window.API_BASE.trim()) ? window.API_BASE : '/api';
const API_PRODUCTS = `${API_BASE}/productos`;
const API_CONTACT = `${API_BASE}/contacto`;
const API_AUTH = `${API_BASE}/auth`;
const API_USERS = `${API_BASE}/usuarios`;

let productsCache = [];
let perPage = 6;
let currentShown = 0;

function showTopAlert(msg, type='info', timeout=3000) {
  const existing = document.getElementById('top-alert');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'top-alert';
  div.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow`;
  div.style.zIndex = 1060;
  div.innerText = msg;
  document.body.appendChild(div);
  setTimeout(()=>{ const e=document.getElementById('top-alert'); if(e) e.remove(); }, timeout);
}

async function safeParseJson(resp) {
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) return resp.json();
  const text = await resp.text();
  throw new Error('Respuesta inesperada (no JSON): ' + text.slice(0,200));
}

function getCart() { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch(e){ return []; } }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s,it)=>s+(it.qty||0),0);
  const el = document.getElementById('cart-count'); if (el) el.innerText = count;
}

async function loadProducts() {
  try {
    const r = await fetch(API_PRODUCTS);
    if (!r.ok) throw new Error('API productos ' + r.status);
    const data = await safeParseJson(r);
    productsCache = Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('No se pudo cargar productos:', err.message);
    productsCache = [
      { id: 1, nombre: 'iPhone demo', descripcion: 'Demo', precio: 800, image_url: 'https://via.placeholder.com/400x300?text=iPhone' },
      { id: 2, nombre: 'MacBook demo', descripcion: 'Demo', precio: 1200, image_url: 'https://via.placeholder.com/400x300?text=MacBook' },
      { id: 3, nombre: 'AirPods demo', descripcion: 'Demo', precio: 199, image_url: 'https://via.placeholder.com/400x300?text=AirPods' }
    ];
    showTopAlert('No se pudieron cargar productos del servidor — mostramos ejemplos', 'warning', 4000);
  }
  currentShown = Math.min(perPage, productsCache.length);
  renderProductsPart();
}

function resolveImage(p) {
  const candidates = [p.image_url, p.imagen, p.image, p.img, p.imagen_url];
  for (const c of candidates) if (c && c.trim()) return c;
  return 'https://via.placeholder.com/400x300?text=Producto';
}

function renderProductsPart() {
  const container = document.getElementById('products');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < currentShown; i++) {
    const p = productsCache[i];
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';
    const imgSrc = resolveImage(p);
    const precio = p.precio !== undefined ? p.precio : p.price || 0;
    col.innerHTML = `
      <div class="card h-100">
        <img src="${imgSrc}" class="card-img-top" style="object-fit:cover; height:160px;" alt="${(p.nombre||'Producto')}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${p.nombre || ''}</h6>
          <p class="card-text small text-muted mb-1">${(p.descripcion||'').slice(0,80)}</p>
          <p class="card-text text-success fw-bold mb-2">$${precio}</p>
          <div class="mt-auto">
            <button class="btn btn-sm btn-primary w-100 add-cart" data-id="${p.id}"><i class="fa fa-cart-plus"></i> Agregar</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  }

  const btn = document.getElementById('btnShowMore');
  if (!btn) return;
  if (currentShown >= productsCache.length) btn.style.display = 'none'; else btn.style.display = 'inline-block';

  document.querySelectorAll('.add-cart').forEach(b => {
    b.removeEventListener('click', addCartHandler);
    b.addEventListener('click', addCartHandler);
  });
}

function addCartHandler(e) { addToCart(e.currentTarget.dataset.id); }

function addToCart(id) {
  const pid = Number(id);
  const prod = productsCache.find(p => Number(p.id) === pid);
  if (!prod) { showTopAlert('Producto no disponible', 'danger'); return; }
  const cart = getCart();
  const it = cart.find(x => Number(x.id) === Number(prod.id));
  if (it) it.qty = (it.qty||0) + 1; else cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio || 0, qty: 1 });
  saveCart(cart);
  showTopAlert('Producto agregado', 'success', 1200);
}

function persistOutbox(payload) {
  try {
    const out = JSON.parse(localStorage.getItem('outbox') || '[]');
    out.push({ ...payload, createdAt: new Date().toISOString() });
    localStorage.setItem('outbox', JSON.stringify(out));
  } catch(e) { console.warn('No se pudo guardar outbox', e); }
}

async function handleLogin(email, password) {
  try {
    const r = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ correo: email, password }) });
    if (r.ok) {
      const payload = await safeParseJson(r);
      return { ok: true, user: payload.user || payload };
    } else {
      const text = await r.text().catch(()=>'');
      return { ok: false, status: r.status, message: text };
    }
  } catch (err) { return { ok: false, message: err.message }; }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadProducts();

  const navArea = document.getElementById('nav-user-area');
  const sess = sessionStorage.getItem('user');
  if (sess && navArea) {
    const user = JSON.parse(sess);
    navArea.innerHTML = `
      <span class="me-3">Hola, ${user.nombre}</span>
      <button id="btnLogout" class="btn btn-outline-danger btn-sm me-2">Cerrar sesión</button>
      ${user.rol === 'admin' ? '<a href="/Admin.html" class="btn btn-primary btn-sm">Panel</a>' : ''}
    `;
    document.getElementById('btnLogout').addEventListener('click', () => {
      sessionStorage.removeItem('user');
      window.location.reload();
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('contactName')||{}).value || '';
      const message = (document.getElementById('contactMessage')||{}).value || '';
      if (!name.trim() || !message.trim()) { showTopAlert('Complete nombre y mensaje', 'warning'); return; }
      const payload = { nombre: name.trim(), mensaje: message.trim() };
      const btn = document.getElementById('contactSubmit'); if (btn) btn.disabled = true;
      try {
        const r = await fetch(API_CONTACT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (r.ok) {
          showTopAlert('Mensaje enviado. ¡Gracias!', 'success');
          contactForm.reset();
        } else {
          persistOutbox(payload);
          showTopAlert('No se pudo enviar al servidor. Guardado localmente.', 'warning', 4000);
          contactForm.reset();
        }
      } catch (err) {
        console.warn(err);
        persistOutbox(payload);
        showTopAlert('Error de red. Mensaje guardado localmente.', 'warning', 4000);
        contactForm.reset();
      } finally { if (btn) btn.disabled = false; }
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('loginUser')||{}).value.trim();
      const pass = (document.getElementById('loginPass')||{}).value;
      if (!email || !pass) { showTopAlert('Ingrese credenciales', 'warning'); return; }
      const btn = document.getElementById('loginSubmit'); if (btn) btn.disabled = true;
      const res = await handleLogin(email, pass);
      if (res.ok) {
        sessionStorage.setItem('user', JSON.stringify(res.user));
        const modalEl = document.getElementById('loginModal');
        if (modalEl) { const bs = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); bs.hide(); }
        if (res.user && res.user.rol === 'admin') location.href = '/Admin.html';
        else setTimeout(()=>location.reload(), 400);
      } else {
        console.warn('Login failed:', res);
        if (res.status === 401) showTopAlert('Credenciales inválidas', 'danger', 3000);
        else showTopAlert('Error al iniciar sesión: ' + (res.message || res.error || 'unknown'), 'danger', 4000);
      }
      if (btn) btn.disabled = false;
    });
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = (document.getElementById('regName')||{}).value.trim();
      const correo = (document.getElementById('regEmail')||{}).value.trim();
      const pass = (document.getElementById('regPass')||{}).value;
      const pass2 = (document.getElementById('regPass2')||{}).value;
      if (!nombre || !correo || !pass) { showTopAlert('Complete todos los campos', 'warning'); return; }
      if (pass.length < 6) { showTopAlert('Contraseña mínimo 6 caracteres', 'warning'); return; }
      if (pass !== pass2) { showTopAlert('Contraseñas no coinciden', 'warning'); return; }
      const btn = document.getElementById('registerSubmit'); if (btn) btn.disabled = true;
      try {
        const r = await fetch(API_USERS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre, correo, password: pass, rol: 'cliente' }) });
        if (r.status === 201 || r.ok) {
          showTopAlert('Cuenta creada. Iniciando sesión...', 'success', 2000);
          const lg = await handleLogin(correo, pass);
          if (lg.ok) {
            sessionStorage.setItem('user', JSON.stringify(lg.user));
            const modalEl = document.getElementById('registerModal');
            if (modalEl) { const bs = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); bs.hide(); }
            if (lg.user && lg.user.rol === 'admin') location.href = '/Admin.html'; else setTimeout(()=>location.reload(),400);
            return;
          } else {
            showTopAlert('Cuenta creada, pero no se pudo autologin', 'warning', 3000);
            setTimeout(()=>location.reload(),500);
          }
        } else {
          const txt = await r.text().catch(()=>'');
          let payload;
          try { payload = JSON.parse(txt); } catch(e){ payload = { error: txt }; }
          showTopAlert(payload.error || 'Error creando cuenta', 'danger', 4000);
        }
      } catch (err) {
        console.error('Registro error:', err);
        showTopAlert('Error creando cuenta: ' + err.message, 'danger', 4000);
      } finally { if (btn) btn.disabled = false; }
    });
  }

  document.getElementById('btnShowMore')?.addEventListener('click', () => {
    currentShown = Math.min(productsCache.length, currentShown + perPage);
    renderProductsPart();
  });
});
