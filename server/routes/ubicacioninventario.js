const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemaprestamos"
});

router.post("/registrarUbicacionInventario", (req, res) => {
    const clave_UbicacionInventario = req.body.clave_UbicacionInventario;
    const nombre_UbicacionInventario = req.body.nombre_UbicacionInventario;

    db.query('SELECT * FROM ubicacioninventario WHERE clave_UbicacionInventario = ?',[clave_UbicacionInventario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la Ubicacion de Inventario ya existe");
        }
        db.query('SELECT * FROM ubicacioninventario WHERE nombre_UbicacionInventario = ?',[nombre_UbicacionInventario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre de la Ubicacion Inventario ya existe");
            }
            
            db.query('INSERT INTO ubicacioninventario(clave_UbicacionInventario, nombre_UbicacionInventario) VALUES (?, ?)',
            [clave_UbicacionInventario, nombre_UbicacionInventario], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Ubicacion de Inventario registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarUbicacionInventario", (req, res) => {
    db.query('SELECT * FROM ubicacioninventario', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUbicacionInventario", (req, res) => {
    const clave_UbicacionInventario = req.body.clave_UbicacionInventario;
    const nombre_UbicacionInventario = req.body.nombre_UbicacionInventario;
    db.query('SELECT * FROM ubicacioninventario WHERE nombre_UbicacionInventario = ? AND clave_UbicacionInventario != ?',[nombre_UbicacionInventario,clave_UbicacionInventario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre de la Ubicacion de Inventario ya existe");
        }
        db.query('UPDATE ubicacioninventario SET nombre_UbicacionInventario = ?, clave_UbicacionInventario = ?  WHERE clave_UbicacionInventario = ?',
        [clave_UbicacionInventario,nombre_UbicacionInventario],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Ubicacion de Inventario modificada con exito");        
        });
    });    
});

module.exports = router;