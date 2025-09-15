const express = require("express");
const router = express.Router();

// 🛒 Array temporal para guardar pedidos en memoria
let pedidos = [];

// ✅ Obtener todos los pedidos
router.get("/", (req, res) => {
  res.json(pedidos);
});

// ✅ Crear un nuevo pedido
router.post("/", (req, res) => {
  const nuevoPedido = {
    id: pedidos.length + 1,
    productos: req.body.productos || [],
    total: req.body.total || 0,
    cliente: req.body.cliente || "Anónimo",
    fecha: new Date()
  };

  pedidos.push(nuevoPedido);

  res.status(201).json({
    mensaje: "Pedido registrado con éxito",
    pedido: nuevoPedido
  });
});

module.exports = router;
