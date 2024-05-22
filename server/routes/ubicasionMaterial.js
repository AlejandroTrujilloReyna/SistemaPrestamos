const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:""
});

router.post("/registrarUbicacionMaterial", (req, res) => {
    const clave_UbicacionMaterial = req.body.clave_UbicacionMaterial;
    const nombre_UbicacionMaterial = req.body.nombre_UbicacionMaterial;

    db.query('SELECT * FROM ubicacionMaterial WHERE clave_UbicacionMaterial = ?',[clave_UbicacionMaterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Ubicacion Material ya existe");
        }
        db.query('SELECT * FROM ubicacionMaterial WHERE nombre_UbicacionMaterial = ?',[nombre_UbicacionMaterial], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre del Ubicacion Material ya existe");
            }
            
            db.query('INSERT INTO ubicacionMaterial(clave_UbicacionMaterial, nombre_UbicacionMaterial) VALUES (?, ?)',
            [clave_UbicacionMaterial, nombre_UbicacionMaterial], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Programa educativo registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarUbicacionMaterial", (req, res) => {
    db.query('SELECT * FROM ubicacionMaterial', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUbicacionMaterial", (req, res) => {
    const clave_UbicacionMaterial = req.body.clave_UbicacionMaterial;
    const nombre_UbicacionMaterial = req.body.nombre_UbicacionMaterial;
    db.query('SELECT * FROM ubicacionMaterial WHERE nombre_UbicacionMaterial = ? AND clave_UbicacionMaterial != ?',[nombre_UbicacionMaterial,clave_UbicacionMaterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Ubicacion Material ya existe");
        }
        db.query('UPDATE ubicacionMaterial SET nombre_UbicacionMaterial = ?,  WHERE clave_UbicacionMaterial = ?',
        [nombre_UbicacionMaterial, clave_UbicacionMaterial],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Ubicacion Material modificado con exito");        
        });
    });    
});

module.exports = router;