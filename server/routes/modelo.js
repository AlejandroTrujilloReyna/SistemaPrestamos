// server/routes/marca.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bdsistemaprestamos"
});

// Registrar 
router.post("/registrarModelo", (req, res) => {
    const id_Modelo = req.body.id_Modelo;
    const nombre_Modelo = req.body.nombre_Modelo;

    db.query('SELECT * FROM modelo WHERE id_Modelo = ?', [id_Modelo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El id del modelo ya existe");
        }
        db.query('SELECT * FROM modelo WHERE nombre_Modelo = ?', [nombre_Modelo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }

            if(results.length > 0) {
                return res.status(400).send("El nombre del modelo ya existe");
            }
            
            db.query('INSERT INTO modelo(id_Modelo, nombre_Modelo) VALUES (?,?)', [id_Modelo, nombre_Modelo], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Modelo registrado con éxito");
            });
        });
    });
});

// Consultar 
router.get("/consultarModelos", (req, res) => {
    db.query('SELECT * FROM modelo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

// Modificar 
router.put("/modificarModelo", (req, res) => {
    const id_Modelo = req.body.id_Modelo;
    const nonbre_Modelo = req.body.nombre_Modelo;

    db.query('SELECT * FROM modelo WHERE nombre_Modelo = ? AND id_Modelo != ?', [nonbre_Modelo, id_Modelo], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre del modelo ya existe");
        }
        
        db.query('UPDATE modelo SET nombre_Modelo = ? WHERE id_Modelo = ?', [nonbre_Modelo, id_Modelo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Modelo modificado con éxito");
        });
    });
});

module.exports = router;
