const express = require("express");
const router = express.Router();
const db = require("../db");

    // db es la conexión con la BD
    db
router.post("/registrarProgramaEducativo", (req, res) => {
   
        const id_ProgramaEducativo = req.body.id_ProgramaEducativo;
        const nombre_ProgramaEducativo = req.body.nombre_ProgramaEducativo;
        
        db.query('SELECT * FROM programaeducativo WHERE id_ProgramaEducativo = ?',[id_ProgramaEducativo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(400).send("La clave del Programa Educativo ya existe");
            }
         
            db.query('SELECT * FROM programaeducativo WHERE nombre_ProgramaEducativo = ?',[nombre_ProgramaEducativo], (err, results) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
        
                if(results.length > 0) {
                    return res.status(401).send("El nombre del programa eductivo ya existe");
                }

            db.query('INSERT INTO programaeducativo (id_ProgramaEducativo, nombre_ProgramaEducativo) VALUES (?, ?)',
                [id_ProgramaEducativo, nombre_ProgramaEducativo], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Programa Educativo registrado con éxito");
            });
        });
        });
    });

    router.get("/consultarProgramaEducativo", (req, res) => {
        db.query('SELECT * FROM programaeducativo ORDER BY id_ProgramaEducativo', (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
          res.status(200).json(results);
        });
    });
    
    
    router.put("/modificarProgramaEducativo", (req, res) => {
        const id_ProgramaEducativo = req.body.id_ProgramaEducativo;
        const nombre_ProgramaEducativo = req.body.nombre_ProgramaEducativo;
        db.query('SELECT * FROM programaeducativo WHERE nombre_ProgramaEducativo = ?',[nombre_ProgramaEducativo], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre del Permiso Usuario ya existe");
            }
            
            db.query('UPDATE programaeducativo SET nombre_ProgramaEducativo=? WHERE id_ProgramaEducativo=?',[nombre_ProgramaEducativo,id_ProgramaEducativo],(err,result) =>{
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Programa Educativo modificado con exito");        
            });
        });
    });    

module.exports = router;
/*
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemahorarios"
});

router.post("/registrarUnidadAcademica",(req,res)=>{
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;
    const nombre_UnidadAcademica = req.body.nombre_UnidadAcademica;

    db.query('SELECT * FROM unidadacademica WHERE clave_UnidadAcademica = ?',[clave_UnidadAcademica], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave de la Unidad Académica ya existe");
        }
        
        db.query('SELECT * FROM unidadacademica WHERE nombre_UnidadAcademica = ?',[nombre_UnidadAcademica], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(401).send("El nombre de la Unidad Académica ya existe");
            }

            db.query('INSERT INTO unidadacademica(clave_UnidadAcademica, nombre_UnidadAcademica) VALUES (?, ?)',
            [clave_UnidadAcademica, nombre_UnidadAcademica], (err, result) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Unidad Académica registrada con éxito");
            });  
        });
    });
});

router.get("/consultarUnidadAcademica", (req, res) => {
    db.query('SELECT * FROM unidadacademica', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarUnidadAcademica", (req, res) => {
    const clave_UnidadAcademica = req.body.clave_UnidadAcademica;
    const nombre_UnidadAcademica = req.body.nombre_UnidadAcademica;
    db.query('SELECT * FROM unidadacademica WHERE nombre_UnidadAcademica = ?',[nombre_UnidadAcademica], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El nombre de la Unidad Académica ya existe");
        }

        db.query('UPDATE unidadacademica SET nombre_UnidadAcademica = ? WHERE clave_UnidadAcademica = ?',[nombre_UnidadAcademica,clave_UnidadAcademica],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
              }
            res.status(200).send("Unidad Academica modificada con exito");        
        });
    });
});

module.exports = router;
*/