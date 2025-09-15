// routes/contacto.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  try {
    const { nombre, mensaje } = req.body || {};
    if (!nombre || !mensaje) return res.status(400).json({ error: 'Nombre y mensaje son requeridos' });

    try {
      await db.query('INSERT INTO contactos (nombre, mensaje, creado_en) VALUES (?, ?, NOW())', [nombre, mensaje]);
      return res.status(201).json({ ok: true, message: 'Mensaje guardado' });
    } catch (err) {
      console.warn('No se pudo insertar contacto en BD:', err.message);
      return res.status(200).json({ ok: true, message: 'Mensaje recibido (no guardado en BD)' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en contacto' });
  }
});

module.exports = router;

