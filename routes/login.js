const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { usuario, password } = req.body;

  if (usuario === "admin" && password === "1234") {
    res.json({ msg: "Login exitoso" });
  } else {
    res.status(401).json({ msg: "Credenciales incorrectas" });
  }
});

module.exports = router;


