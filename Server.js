require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// ----- Config -----
const PORT = process.env.PORT || 5000;
const API_BASE = process.env.API_BASE || '/api';

// Allowed origins (se configuran en .env separados por coma)
const rawAllowed = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ----- Middlewares -----
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (rawAllowed.length === 0) return callback(null, true);
    if (rawAllowed.includes(origin)) return callback(null, true);
    callback(new Error('CORS policy: Origin not allowed: ' + origin));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Logging simple
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// ----- Rutas API -----
app.use(`${API_BASE}/productos`, require('./routes/productos'));
app.use(`${API_BASE}/usuarios`, require('./routes/usuarios'));
app.use(`${API_BASE}/auth`, require('./routes/auth'));
app.use(`${API_BASE}/contacto`, require('./routes/contacto'));
app.use(`${API_BASE}/pedidos`, require('./routes/pedidos'));

// ----- Archivos estáticos -----
const publicPath = path.join(__dirname, 'tienda_virtual', 'public');
app.use(express.static(publicPath));

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Fallback SPA
app.use((req, res, next) => {
  if (req.path.startsWith(API_BASE)) {
    return res.status(404).json({ error: 'Ruta de API no encontrada' });
  }
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ----- Start server -----
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor funcionando en http://localhost:${PORT} (API base: ${API_BASE})`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Cerrando servidor...');
  server.close(() => process.exit(0));
});
