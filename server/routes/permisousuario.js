const express = require("express");
const router = express.Router();
const db = require("../db");

/*const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemaprestamo"
});*/
    // Conexión con Base de Datos
    db
    router.post("/registrarPermisoUsuario", (req, res) => {
        const id_PermisoUsuario = req.body.id_PermisoUsuario;
        const nombre_PermisoUsuario = req.body.nombre_PermisoUsuario;
        
        db.query('SELECT * FROM permisousuario WHERE nombre_PermisoUsuario = ?',[id_PermisoUsuario], (err, results) => {
            if(err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
    
            if(results.length > 0) {
                return res.status(400).send("El nombre del Permiso Usuario ya existe");
            }
                
            db.query('INSERT INTO permisousuario (id_PermisoUsuario, nombre_PermisoUsuario) VALUES (?, ?, ?, ?)',
                [id_PermisoUsuario,nombre_PermisoUsuario], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Error interno del servidor");
                    }
                    res.status(200).send("Edificio registrado con éxito");
            });
        });
    });

module.exports = router;