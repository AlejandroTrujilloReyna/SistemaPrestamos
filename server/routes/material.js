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
    const descripcion_Material = req.body.descripcion_Material;
    const permiso_Prestamo = req.body.permiso_Prestamo;
    const id_Categoria = req.body.id_Categoria;
    const id_Marca = req.body.id_Marca;
    const id_Modelo = req.body.id_Modelo;
    const id_Estado = req.body.id_Estado;
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
            
            db.query('SELECT * FROM meterial WHERE descripcion_Material = ?',[descripcion_Material], (err, results) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send("Error meterial del servidor");
                }
        
                if(results.length > 0) {
                    return res.status(401).send("la descripcion del Meterial ya existe");
                }
                
                db.query('SELECT * FROM meterial WHERE permiso_Prestamo = ?',[permiso_Prestamo], (err, results) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).send("Error meterial del servidor");
                    }
            
                    if(results.length > 0) {
                        return res.status(401).send("El permiso del Meterial ya existe");
                    }
                    
                    db.query('SELECT * FROM meterial WHERE id_Categoria = ?',[id_Categoria], (err, results) => {
                        if(err) {
                            console.log(err);
                            return res.status(500).send("Error meterial del servidor");
                        }
                
                        if(results.length > 0) {
                            return res.status(401).send("La categoria del Meterial ya existe");
                        }
                        
                        db.query('SELECT * FROM meterial WHERE id_Marca = ?',[id_Marca], (err, results) => {
                            if(err) {
                                console.log(err);
                                return res.status(500).send("Error meterial del servidor");
                            }
                    
                            if(results.length > 0) {
                                return res.status(401).send("La Marca ya existe");
                            }
                            
                            db.query('SELECT * FROM meterial WHERE id_Modelo = ?',[id_Modelo], (err, results) => {
                                if(err) {
                                    console.log(err);
                                    return res.status(500).send("Error meterial del servidor");
                                }
                        
                                if(results.length > 0) {
                                    return res.status(401).send("El Modelo del Meterial ya existe");
                                }
                                
                                db.query('SELECT * FROM meterial WHERE id_Estado = ?',[id_Estado], (err, results) => {
                                    if(err) {
                                        console.log(err);
                                        return res.status(500).send("Error meterial del servidor");
                                    }
                            
                                    if(results.length > 0) {
                                        return res.status(401).send("El Nombre del Meterial ya existe");
                                    }

                                    db.query('INSERT INTO meterial(clave_Meterial, nombre_Meterial, clave_UbicacionMeterial) VALUES (?, ?, ?)',
                                    [clave_Meterial, nombre_Meterial, descripcion_Material, permiso_Prestamo, id_Categoria, id_Marca, id_Modelo, id_Estado, clave_UbicacionMeterial], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            return res.status(500).send("Error meterial del servidor");
                                        }
                                        res.status(200).send("Material registrado con éxito");
                                    });  
                                });
                            });
                        });
                    });
                });
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
    const descripcion_Material = req.body.descripcion_Material;
    const permiso_Prestamo = req.body.permiso_Prestamo;
    const id_Categoria = req.body.id_Categoria;
    const id_Marca = req.body.id_Marca;
    const id_Modelo = req.body.id_Modelo;
    const id_Estado = req.body.id_Estado;
    const clave_UbicacionMeterial = req.body.clave_UbicacionMeterial;
    db.query('SELECT * FROM meterial WHERE id_Estado = ? AND id_Modelo = ? AND id_Marca = ? AND id_Categoria = ? AND permiso_Prestamo = ? AND descripcion_Material = ? AND nombre_Meterial = ? AND clave_Meterial != ?',[id_Estado,id_Modelo,id_Marca,id_Categoria,permiso_Prestamo,descripcion_Material,nombre_Meterial,clave_Meterial], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error meterial del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Meterial ya existe");
        }
        db.query('UPDATE meterial SET nombre_Meterial = ?, descripcion_Material = ?, permiso_Prestamo = ?, id_Categoria = ?, id_Marca = ?, id_Modelo = ?, id_Estado = ?, clave_UbicacionMeterial = ?  WHERE clave_Meterial = ?',
        [nombre_Meterial, descripcion_Material, permiso_Prestamo, id_Categoria, id_Marca, id_Modelo, id_Estado, clave_UbicacionMeterial, clave_Meterial],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error meterial del servidor");
            }
            res.status(200).send("Meterial modificado con exito");        
        });
    });    
});

module.exports = router;