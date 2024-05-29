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
router.post("/registrarMarca", (req, res) => {
    const id_Marca = req.body.id_Marca;
    const nombre_Marca = req.body.nombre_Marca;

    db.query('SELECT * FROM marca WHERE id_Marca = ?', [id_Marca], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("El id de la marca ya existe");
        }
        db.query('SELECT * FROM marca WHERE nombre_Marca = ?', [nombre_Marca], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }

            if(results.length > 0) {
                return res.status(400).send("El nombre de la marca ya existe");
            }
            
            db.query('INSERT INTO marca(id_Marca, nombre_Marca) VALUES (?,?)', [id_Marca, nombre_Marca], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Marca registrada con éxito");
            });
        });
    });
});

// Consultar 
router.get("/consultarMarcas", (req, res) => {
    db.query('SELECT * FROM marca', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

// Modificar 
router.put("/modificarMarca", (req, res) => {
    const id_Marca = req.body.id_Marca;
    const nombre_Marca = req.body.nombre_Marca;

    db.query('SELECT * FROM marca WHERE nombre_Marca = ? AND id_Marca != ?', [nombre_Marca, id_Marca], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre de la marca ya existe");
        }
        
        db.query('UPDATE marca SET nombre_Marca = ? WHERE id_Marca = ?', [nombre_Marca, id_Marca], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Marca modificada con éxito");
        });
    });
});

module.exports = router;
