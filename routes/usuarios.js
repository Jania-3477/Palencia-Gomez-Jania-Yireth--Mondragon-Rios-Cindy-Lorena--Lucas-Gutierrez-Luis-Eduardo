// routes/usuarios.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Listar usuarios (sin password)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, correo, rol FROM usuarios ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('GET /api/usuarios error:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear (registro)
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body || {};
    if (!nombre || !correo || !password) return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });

    const [exists] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (exists && exists.length > 0) return res.status(400).json({ error: 'El correo ya está registrado' });

    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', [nombre, correo, hash, rol || 'cliente']);
    res.status(201).json({ ok: true, message: 'Usuario creado correctamente' });
  } catch (err) {
    console.error('POST /api/usuarios error:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Obtener por id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query('SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /api/usuarios/:id error:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar usuario (si envian password lo hashea)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, rol, password } = req.body || {};
    if (!nombre || !correo) return res.status(400).json({ error: 'Nombre y correo son requeridos' });

    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
      await db.query('UPDATE usuarios SET nombre=?, correo=?, rol=?, password=? WHERE id=?', [nombre, correo, rol || 'cliente', hash, id]);
    } else {
      await db.query('UPDATE usuarios SET nombre=?, correo=?, rol=? WHERE id=?', [nombre, correo, rol || 'cliente', id]);
    }
    res.json({ ok: true, message: 'Usuario actualizado' });
  } catch (err) {
    console.error('PUT /api/usuarios/:id error:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ ok: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error('DELETE /api/usuarios/:id error:', err);
    if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar: usuario con pedidos asociados' });
    }
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;
