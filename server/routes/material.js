const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"bdsistemaprestamos"
});

router.post("/registrarMaterial", (req, res) => {
    const id_Material = req.body.id_Material;
    const nombre_Material = req.body.nombre_Material;
    const descripcion_Material = req.body.descripcion_Material;
    const permiso_Prestamo = req.body.permiso_Prestamo;
    const id_Categoria = req.body.id_Categoria;
    const id_Marca = req.body.id_Marca;
    const id_Modelo = req.body.id_Modelo;
    const id_Estado = req.body.id_Estado;
    const id_UbicacionMaterial = req.body.id_UbicacionMaterial;

    db.query('SELECT * FROM material WHERE id_Material = ?',[id_Material], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error material del servidor");
        }

        if(results.length > 0) {
            return res.status(400).send("La clave del Meterial ya existe");
        }

            db.query('INSERT INTO material(id_Material, nombre_Material, descripcion_Material, permiso_Prestamo, id_Categoria, id_Marca, id_Modelo, id_Estado, id_UbicacionMaterial) VALUES (?,?,?,?,?,?,?,?,?)',
                [id_Material, nombre_Material, descripcion_Material, permiso_Prestamo, id_Categoria, id_Marca, id_Modelo, id_Estado, id_UbicacionMaterial], (err, result) => {
                    if (err) {
                        console.log(err);
                            return res.status(500).send("Error meterial del servidor");
                        }
                        res.status(200).send("Material registrado con éxito");
                    });  
                });
             });

router.get("/consultarMaterial", (req, res) => {
    db.query('SELECT * FROM Material', (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error meterial del servidor");
      }
      res.status(200).json(results);
    });
});

router.put("/modificarMaterial", (req, res) => {
    const id_Material = req.body.id_Material;
    const nombre_Material = req.body.nombre_Material;
    const descripcion_Material = req.body.descripcion_Material;
    const permiso_Prestamo = req.body.permiso_Prestamo;
    const id_Categoria = req.body.id_Categoria;
    const id_Marca = req.body.id_Marca;
    const id_Modelo = req.body.id_Modelo;
    const id_Estado = req.body.id_Estado;
    const id_UbicacionMaterial = req.body.id_UbicacionMaterial;
    db.query('SELECT * FROM material WHERE id_Estado = ? AND id_Modelo = ? AND id_Marca = ? AND id_Categoria = ? AND permiso_Prestamo = ? AND descripcion_Material = ? AND nombre_Material = ? AND id_Material != ?',[id_Estado,id_Modelo,id_Marca,id_Categoria,permiso_Prestamo,descripcion_Material,nombre_Material,id_Material], (err, results) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error meterial del servidor");
        }

        if(results.length > 0) {
            return res.status(401).send("El Nombre del Meterial ya existe");
        }
        db.query('UPDATE material SET nombre_Material = ?, descripcion_Material = ?, permiso_Prestamo = ?, id_Categoria = ?, id_Marca = ?, id_Modelo = ?, id_Estado = ?, id_UbicacionMaterial = ?  WHERE id_Material = ?',
        [nombre_Material, descripcion_Material, permiso_Prestamo, id_Categoria, id_Marca, id_Modelo, id_Estado, id_UbicacionMaterial, id_Material],(err,result) =>{
            if (err) {
                console.log(err);
                return res.status(500).send("Error meterial del servidor");
            }
            res.status(200).send("Material modificado con exito");        
        });
    });    
});

router.delete("/eliminarMaterial/:id_Material", (req,res)=>{
    const id_Material = req.params.id_Material;
    
    db.query('DELETE FROM material WHERE id_Material=?', [id_Material], (err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.status(200).send("Material Eliminado con exito")
        }
    })

})

module.exports = router;