const express = require("express");
const router = express.Router();
const db = require("../db");

    // db es la conexión con la BD
    db
router.post("/registrarTipoSolicitante", (req, res) => {
    
        const id_TipoSolicitante = req.body.id_TipoSolicitante;
        const nombre_TipoSolicitante = req.body.nombre_TipoSolicitante;
        
        db.query('SELECT * FROM tiposolicitante WHERE id_TipoSolicitante = ?',[id_TipoSolicitante], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(400).send("La clave del tipo de solicitante ya existe");
            }
                
            db.query('SELECT * FROM tiposolicitante WHERE nombre_TipoSolicitante = ?',[nombre_TipoSolicitante], (err, results) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
        
                if(results.length > 0) {
                    return res.status(401).send("El nombre del tipo de solicitante ya existe");
                }

            db.query('INSERT INTO tiposolicitante (id_TipoSolicitante, nombre_TipoSolicitante) VALUES (?, ?)',
                [id_TipoSolicitante, nombre_TipoSolicitante], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Tipo de Solicitante registrado con éxito");
            });
        });
        });
    });

    router.get("/consultarTipoSolicitante", (req, res) => {
        db.query('SELECT * FROM tiposolicitante ORDER BY id_TipoSolicitante', (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
          res.status(200).json(results);
        });
    });
    
    
    router.put("/modificarTipoSolicitante", (req, res) => {
        const id_TipoSolicitante = req.body.id_TipoSolicitante;
        const nombre_TipoSolicitante = req.body.nombre_TipoSolicitante;
        db.query('SELECT * FROM tiposolicitante WHERE nombre_TipoSolicitante = ?',[nombre_TipoSolicitante], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Tipo de Solicitante ya existe");
            }
            
            db.query('UPDATE tiposolicitante SET nombre_TipoSolicitante=? WHERE id_TipoSolicitante=?',[nombre_TipoSolicitante, id_TipoSolicitante ],(err,result) =>{
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Tipo de solicitante modificado con exito");        
            });
        });
    });    

module.exports = router;