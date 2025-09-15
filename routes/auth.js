// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');           // tu mysql2/promise pool
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body || {};
    if (!correo || !password) return res.status(400).json({ error: 'Correo y contraseña requeridos' });

    const [rows] = await db.query('SELECT id, nombre, correo, password, rol FROM usuarios WHERE correo = ?', [correo]);
    if (!rows || rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const safeUser = { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol };
    return res.json({ ok: true, user: safeUser });
  } catch (err) {
    console.error('❌ /api/auth/login error:', err);
    return res.status(500).json({ error: 'Error interno en autenticación' });
  }
});

module.exports = router;
