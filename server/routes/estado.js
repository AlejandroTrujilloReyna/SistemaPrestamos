// server/routes/estado.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bdsistemaprestamos"
});

// Registrar Estado
router.post("/registrarEstado", (req, res) => {
    const nombre_Estado = req.body.nombre_Estado;

    db.query('SELECT * FROM estado WHERE nombre_Estado = ?', [nombre_Estado], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El nombre del estado ya existe");
        }
        
        db.query('INSERT INTO estado(nombre_Estado) VALUES (?)', [nombre_Estado], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Estado registrado con éxito");
        });
    });
});

// Consultar Estados
router.get("/consultarEstados", (req, res) => {
    db.query('SELECT * FROM estado', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

// Modificar Estado
router.put("/modificarEstado", (req, res) => {
    const id_Estado = req.body.id_Estado;
    const nombre_Estado = req.body.nombre_Estado;

    db.query('SELECT * FROM estado WHERE nombre_Estado = ? AND id_Estado != ?', [nombre_Estado, id_Estado], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El nombre del estado ya existe");
        }
        
        db.query('UPDATE estado SET nombre_Estado = ? WHERE id_Estado = ?', [nombre_Estado, id_Estado], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Estado modificado con éxito");
        });
    });
});

module.exports = router;
