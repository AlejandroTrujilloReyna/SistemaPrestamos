const express = require("express");
const router = express.Router();
const db = require("../db");
db

router.get("/consultarMaterial", (req, res) => {
    db.query('SELECT * FROM material', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.get("/consultarMaterialSinPrestar", (req, res) => {
  db.query('SELECT DISTINCT mat.* FROM material AS mat WHERE NOT EXISTS ( SELECT 1 FROM conjuntomaterialprestamo AS cmat WHERE mat.id_Material = cmat.id_Material AND cmat.Prestado = 1 )', (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error interno del servidor");
    }
    res.status(200).json(results);
  });
});

module.exports = router;