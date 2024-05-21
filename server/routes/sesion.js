const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/consultarSesion", (req, res) => {
    const correo = req.body.correo;
    const contrasenia = req.body.contrasenia;
    db.query('SELECT * FROM usuario WHERE correo = ? AND contrasenia = ?', [correo, contrasenia], (err, results) => {
      if (err) {
          console.log(err);
          return res.status(500).send("Error interno del servidor");
      }
      
      if (results.length > 0) {
          return res.status(200).send("Inicio de sesion exitoso");
      } else {
          return res.status(401).send("Correo o contraseña incorrectos");
      }
  });
});

module.exports = router;