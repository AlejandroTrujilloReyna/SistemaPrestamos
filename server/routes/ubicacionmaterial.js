const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemaprestamos"
});

router.post("/registrarUbicacionMaterial", (req, res) => {
    const id_UbicacionMaterial = req.body.id_UbicacionMaterial;
    const nombre_UbicacionMaterial = req.body.nombre_UbicacionMaterial;

    db.query('SELECT * FROM ubicacionmaterial WHERE id_UbicacionMaterial = ?',[id_UbicacionMaterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la Ubicacion de Inventario ya existe");
        }
        db.query('SELECT * FROM ubicacionmaterial WHERE nombre_UbicacionMaterial = ?',[nombre_UbicacionMaterial], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre de la Ubicacion Inventario ya existe");
            }
            
            db.query('INSERT INTO ubicacionmaterial(id_UbicacionMaterial, nombre_UbicacionMaterial) VALUES (?, ?)',
            [id_UbicacionMaterial, nombre_UbicacionMaterial], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Ubicacion de Inventario registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarUbicacionMaterial", (req, res) => {
    db.query('SELECT * FROM ubicacionmaterial', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUbicacionMaterial", (req, res) => {
    const id_UbicacionMaterial = req.body.id_UbicacionMaterial;
    const nombre_UbicacionInventario = req.body.nombre_UbicacionMaterial;
    db.query('SELECT * FROM ubicacionmaterial WHERE nombre_UbicacionMaterial = ? AND id_UbicacionMaterial != ?',[nombre_UbicacionInventario,id_UbicacionMaterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre de la Ubicacion de Inventario ya existe");
        }
        db.query('UPDATE ubicacionmaterial SET nombre_UbicacionMaterial = ? WHERE id_UbicacionMaterial = ?',
        [nombre_UbicacionInventario,id_UbicacionMaterial],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Ubicacion de Inventario modificada con exito");        
        });
    });    
});

module.exports = router;