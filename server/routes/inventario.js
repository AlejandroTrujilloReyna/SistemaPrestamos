const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemaprestamos"
});

router.post("/registrarInventario", (req, res) => {
    const id_Inventario = req.body.id_Inventario;
    const nombre_Inventario = req.body.nombre_Inventario;
    const id_ubicacionInventario = req.body.id_ubicacionInventario;

    db.query('SELECT * FROM inventario WHERE id_Inventario = ?',[id_Inventario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Inventario ya existe");
        }
        db.query('SELECT * FROM inventario WHERE nombre_Inventario = ?',[nombre_Inventario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre del Inventario ya existe");
            }
            
            db.query('INSERT INTO inventario(id_Inventario, nombre_Inventario, id_ubicacionInventario) VALUES (?, ?, ?)',
            [id_Inventario, nombre_Inventario, id_ubicacionInventario], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Programa educativo registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarInventario", (req, res) => {
    db.query('SELECT * FROM inventario', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarInventario", (req, res) => {
    const id_Inventario = req.body.id_Inventario;
    const nombre_Inventario = req.body.nombre_Inventario;
    const id_ubicacionInventario = req.body.id_ubicacionInventario;
    db.query('SELECT * FROM inventario WHERE nombre_Inventario = ? AND id_Inventario != ?',[nombre_Inventario,id_Inventario], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Inventario ya existe");
        }
        db.query('UPDATE inventario SET nombre_Inventario = ?, id_ubicacionInventario = ?  WHERE id_Inventario = ?',
        [nombre_Inventario,id_ubicacionInventario, id_Inventario],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Inventario modificado con exito");        
        });
    });    
});

module.exports = router;