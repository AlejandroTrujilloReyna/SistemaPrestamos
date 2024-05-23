const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemaprestamos"
});

router.post("/registrarCategoria", (req, res) => {
    const id_Categoria = req.body.id_Categoria;
    const nombre_Categoria = req.body.nombre_Categoria;

    db.query('SELECT * FROM ubicacioninventario WHERE id_UbicacionInventario = ?',[id_Categoria], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la categoria ya existe");
        }
        db.query('SELECT * FROM categoria WHERE nombre_Categoria = ?',[nombre_Categoria], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El Nombre de la categoria ya existe");
            }
            
            db.query('INSERT INTO categoria(id_Categoria, nombre_Categoria) VALUES (?, ?)',
            [id_Categoria, nombre_Categoria], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Categoria registrada con éxito");
            });  
        });  
    });
});

router.get("/consultarCategoria", (req, res) => {
    db.query('SELECT * FROM categoria', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarCategoria", (req, res) => {
    const id_Categoria = req.body.id_Categoria;
    const nombre_Categoria = req.body.nombre_Categoria;
    db.query('SELECT * FROM categoria WHERE nombre_Categoria = ? AND id_Categoria != ?',[nombre_Categoria,id_Categoria], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre de la Categoria ya existe");
        }
        db.query('UPDATE categoria SET nombre_Categoria = ? WHERE id_Categoria = ?',
        [nombre_Categoria,id_Categoria],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Categoria modificada con exito");        
        });
    });    
});

module.exports = router;