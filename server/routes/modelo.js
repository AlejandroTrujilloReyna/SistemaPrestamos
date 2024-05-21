// server/routes/modelo.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bdsistemaprestamos"
});

// Registrar Modelo
router.post("/registrarModelo", (req, res) => {
    const nombre_Modelo = req.body.nombre_Modelo;

    db.query('SELECT * FROM modelo WHERE nombre_Modelo = ?', [nombre_Modelo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El nombre del modelo ya existe");
        }
        
        db.query('INSERT INTO modelo(nombre_Modelo) VALUES (?)', [nombre_Modelo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Modelo registrado con éxito");
        });
    });
});

// Consultar Modelos
router.get("/consultarModelos", (req, res) => {
    db.query('SELECT * FROM modelo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

// Modificar Modelo
router.put("/modificarModelo", (req, res) => {
    const id_Modelo = req.body.id_Modelo;
    const nombre_Modelo = req.body.nombre_Modelo;

    db.query('SELECT * FROM modelo WHERE nombre_Modelo = ? AND id_Modelo != ?', [nombre_Modelo, id_Modelo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El nombre del modelo ya existe");
        }
        
        db.query('UPDATE modelo SET nombre_Modelo = ? WHERE id_Modelo = ?', [nombre_Modelo, id_Modelo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Modelo modificado con éxito");
        });
    });
});

module.exports = router;
