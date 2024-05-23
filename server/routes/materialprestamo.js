const express = require("express");
const router = express.Router();
const db = require("../db");
db

router.post("/registrarMaterialPrestamo", (req, res) => {
    const id_ConjuntoMaterialPrestamo = null;
    const materiales = req.body.materiales; 
    const id_Prestamo = req.body.id_Prestamo;    
    const Prestado = 1;
    materiales.forEach(material => {        
        const id_Material = material.id_Material;                        

        // Realiza la lógica de inserción o cualquier otra operación necesaria para cada material
        db.query('SELECT * FROM conjuntomaterialprestamo WHERE id_Material = ? AND id_Prestamo =? AND Prestado = ?',[id_Material,id_Prestamo,Prestado], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }

            if(results.length > 0) {
                return res.status(401).send("El material ya está registrado para este préstamo");
            }

            db.query('INSERT INTO conjuntomaterialprestamo (id_ConjuntoMaterialPrestamo, id_Material,id_Prestamo,Prestado) VALUES (?, ?, ?, ?)',
            [id_ConjuntoMaterialPrestamo, id_Material,id_Prestamo,Prestado], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Material registrado en Prestamo con éxito");
        });        
    });
    });

    res.status(200).send("Materiales registrados con éxito");
});

router.post("/registrarMaterialPrestamoDOS", (req, res) => {
    const id_ConjuntoMaterialPrestamo = null;   
    const id_Material = req.body.id_Material; 
    const id_Prestamo = req.body.id_Prestamo;    
    const Prestado = req.body.Prestado;
        // Realiza la lógica de inserción o cualquier otra operación necesaria para cada material
        db.query('SELECT * FROM conjuntomaterialprestamo WHERE id_Material = ? AND id_Prestamo =? AND Prestado = ?',[id_Material,id_Prestamo,Prestado], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }

            if(results.length > 0) {
                return res.status(401).send("El material ya está registrado para este préstamo");
            }

            db.query('INSERT INTO conjuntomaterialprestamo (id_ConjuntoMaterialPrestamo, id_Material,id_Prestamo,Prestado) VALUES (?, ?, ?, ?)',
            [id_ConjuntoMaterialPrestamo, id_Material,id_Prestamo,Prestado], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Material registrado en Prestamo con éxito");
        });        
    });
});

router.get("/consultarMaterialPrestamo", (req, res) => {
    db.query('SELECT * FROM conjuntomaterialprestamo', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.get("/consultarMaterialPrestamoPrestamo", (req, res) => {
    const id_ConjuntoMaterialPrestamo = req.body.id_ConjuntoMaterialPrestamo;
    db.query('SELECT * FROM conjuntomaterialprestamo WHERE id_ConjuntoMaterialPrestamo =?',[id_ConjuntoMaterialPrestamo], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

module.exports = router;