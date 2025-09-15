// routes/productos.js
const express = require('express');
const router = express.Router();
const db = require('../db');

const ejemplo = [
  { id: 1, nombre: 'iPhone 15', descripcion: 'iPhone 15 - 128GB', precio: 999.00, image_url: '/img/iphone15.jpg' },
  { id: 2, nombre: 'MacBook Air M2', descripcion: 'MacBook Air M2', precio: 1299.00, image_url: '/img/macbookair_m2.jpg' },
  { id: 3, nombre: 'AirPods Pro', descripcion: 'Auriculares', precio: 249.00, image_url: '/img/airpods_pro.jpg' }
];

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, descripcion, precio, image_url FROM productos ORDER BY id');
    if (!rows || rows.length === 0) return res.json(ejemplo);
    return res.json(rows);
  } catch (err) {
    console.warn('Error leyendo productos, devolviendo ejemplo:', err.message);
    return res.json(ejemplo);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT id, nombre, descripcion, precio, image_url FROM productos WHERE id = ?', [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

module.exports = router;
