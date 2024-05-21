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
    const id_UbicacionInventario = req.body.id_UbicacionInventario;
    const nombre_ubicacioninventario = req.body.nombre_ubicacioninventario;

    db.query('SELECT * FROM ubicacioninventario WHERE id_UbicacionInventario = ?',[id_UbicacionInventario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la Ubicacion de Inventario ya existe");
        }
        db.query('SELECT * FROM ubicacioninventario WHERE nombre_ubicacioninventario = ?',[nombre_ubicacioninventario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre de la Ubicacion Inventario ya existe");
            }
            
            db.query('INSERT INTO ubicacioninventario(id_UbicacionInventario, nombre_ubicacioninventario) VALUES (?, ?)',
            [id_UbicacionInventario, nombre_ubicacioninventario], (err, result) => {
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
    const id_UbicacionInventario = req.body.id_UbicacionInventario;
    const nombre_ubicacioninventario = req.body.nombre_ubicacioninventario;
    db.query('SELECT * FROM ubicacioninventario WHERE nombre_ubicacioninventario = ? AND id_UbicacionInventario != ?',[nombre_ubicacioninventario,id_UbicacionInventario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre de la Ubicacion de Inventario ya existe");
        }
        db.query('UPDATE ubicacioninventario SET nombre_ubicacioninventario = ? WHERE id_UbicacionInventario = ?',
        [nombre_ubicacioninventario,id_UbicacionInventario],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Ubicacion de Inventario modificada con exito");        
        });
    });    
});

module.exports = router;