const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:""
});

router.post("/registrarMeterial", (req, res) => {
    const clave_Meterial = req.body.clave_Meterial;
    const nombre_Meterial = req.body.nombre_Meterial;
    const clave_UbicacionMeterial = req.body.clave_UbicacionMeterial;

    db.query('SELECT * FROM meterial WHERE clave_Meterial = ?',[clave_Meterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error meterial del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Meterial ya existe");
        }
        db.query('SELECT * FROM meterial WHERE nombre_Meterial = ?',[nombre_Meterial], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error meterial del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre del Meterial ya existe");
            }
            
            db.query('INSERT INTO meterial(clave_Meterial, nombre_Meterial, clave_UbicacionMeterial) VALUES (?, ?, ?)',
            [clave_Meterial, nombre_Meterial, clave_UbicacionMeterial], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error meterial del servidor");
                }
                res.status(200).send("Programa educativo registrado con éxito");
            });  
        });  
    });
});

router.get("/consultarMeterial", (req, res) => {
    db.query('SELECT * FROM Meterial', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error meterial del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarMeterial", (req, res) => {
    const clave_Meterial = req.body.clave_Meterial;
    const nombre_Meterial = req.body.nombre_Meterial;
    const clave_UbicacionMeterial = req.body.clave_UbicacionMeterial;
    db.query('SELECT * FROM meterial WHERE nombre_Meterial = ? AND clave_Meterial != ?',[nombre_Meterial,clave_Meterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error meterial del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Meterial ya existe");
        }
        db.query('UPDATE meterial SET nombre_Meterial = ?, clave_UbicacionMeterial = ?  WHERE clave_Meterial = ?',
        [nombre_Meterial,clave_UbicacionMeterial, clave_Meterial],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error meterial del servidor");
            }
            res.status(200).send("Meterial modificado con exito");        
        });
    });    
});

module.exports = router;