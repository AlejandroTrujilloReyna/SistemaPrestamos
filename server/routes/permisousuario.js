const express = require("express");
const router = express.Router();
const db = require("../db");

    // db es la conexión con la BD
    db
    router.post("/registrarPermisoUsuario", (req, res) => {
        const id_PermisoUsuario = req.body.id_PermisoUsuario;
        const nombre_PermisoUsuario = req.body.nombre_PermisoUsuario;
        
        db.query('SELECT * FROM permisousuario WHERE nombre_PermisoUsuario = ?',[id_PermisoUsuario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Permiso Usuario ya existe");
            }
                
            db.query('INSERT INTO permisousuario (id_PermisoUsuario, nombre_PermisoUsuario) VALUES (?, ?)',
                [id_PermisoUsuario,nombre_PermisoUsuario], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Permiso de Usuario registrado con éxito");
            });
        });
    });

    router.get("/consultarPermisoUsuario", (req, res) => {
        db.query('SELECT * FROM permisousuario ORDER BY id_PermisoUsuario', (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
          res.status(200).json(results);
        });
    });
    
    
    router.put("/modificarPermisoUsuario", (req, res) => {
        const id_PermisoUsuario = req.body.id_PermisoUsuario;
        const nombre_PermisoUsuario = req.body.nombre_PermisoUsuario;
        db.query('SELECT * FROM permisousuario WHERE nombre_PermisoUsuario = ? AND id_PermisoUsuario != ?',[nombre_PermisoUsuario,id_PermisoUsuario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Permiso Usuario ya existe");
            }
            
            db.query('UPDATE permisousuario SET nombre_PermisoUsuario=? WHERE id_PermisoUsuario=?',[nombre_PermisoUsuario,id_PermisoUsuario],(err,result) =>{
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Permiso de Usuario modificado con exito");        
            });
        });
    });    

module.exports = router;