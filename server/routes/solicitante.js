const express = require("express");
const router = express.Router();
const db = require("../db");

    // db es la conexión con la BD
    db
    router.post("/registrarSolicitante", (req, res) => {
        const id_Solicitante = req.body.id_Solicitante;
        const nombre_Solicitante = req.body.nombre_Solicitante;
        const apellidoP_Solicitante = req.body.apellidoP_Solicitante;
        const apellidoM_Solicitate = req.body.apellidoM_Solicitate;
        const semestre = req.body.semestre;
        const activo = req.body.activo;
        const id_TipoSolicitante = req.body.id_TipoSolicitante;
        const id_ProgramaEducativo = req.body.id_ProgramaEducativo;           
        db.query('SELECT * FROM solicitante WHERE id_Solicitante = ?',[id_Solicitante], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El ID del Solicitante ya existe");
            }
            db.query('INSERT INTO solicitante (id_Solicitante, nombre_Solicitante,apellidoP_Solicitante,apellidoM_Solicitate,semestre,activo,id_TipoSolicitante,id_ProgramaEducativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [id_Solicitante, nombre_Solicitante,apellidoP_Solicitante,apellidoM_Solicitate,semestre,activo,id_TipoSolicitante,id_ProgramaEducativo], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Solicitante registrado con éxito");
            }); 
        });        
    });

    router.get("/consultarSolicitante", (req, res) => {
        db.query('SELECT * FROM solicitante ORDER BY id_Solicitante', (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
          res.status(200).json(results);
        });
    });
    
    
    router.put("/modificarSolicitante", (req, res) => {
        const id_Solicitante = req.body.id_Solicitante;
        const nombre_Solicitante = req.body.nombre_Solicitante;
        const apellidoP_Solicitante = req.body.apellidoP_Solicitante;
        const apellidoM_Solicitate = req.body.apellidoM_Solicitate;
        const semestre = req.body.semestre;
        const activo = req.body.activo;
        const id_TipoSolicitante = req.body.id_TipoSolicitante;
        const id_ProgramaEducativo = req.body.id_ProgramaEducativo;  

        db.query('UPDATE solicitante SET nombre_Solicitante=?, apellidoP_Solicitante=?, apellidoM_Solicitate=?, semestre=?, activo=?, id_TipoSolicitante=?, id_ProgramaEducativo=? WHERE id_Solicitante=?',
            [nombre_Solicitante,apellidoP_Solicitante,apellidoM_Solicitate,semestre,activo,id_TipoSolicitante,id_ProgramaEducativo,id_Solicitante],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Solicitante modificado con exito");        
        });        
    });    

module.exports = router;