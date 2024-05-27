const express = require("express");
const router = express.Router();
const db = require("../db");

db
router.get("/validardatos", (req, res) => {
    const correo = req.query.email;
    const contrasenia = req.query.pwd;

    db.query('SELECT id_Usuario, nombre_Usuario, apellidoP_Usuario, apellidoM_Usuario, id_PermisoUsuario  FROM usuario WHERE correo = ? AND contrasenia = ?', [correo, contrasenia], (err, results) => {
            
        if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            if (results.length == 0) {
                return res.status(401).send("Sin resultados");
            }
            if(results.length > 1){
                return res.status(402).send("Sin resultados");
            }
            res.status(200).json(results);
        });

})

module.exports = router;