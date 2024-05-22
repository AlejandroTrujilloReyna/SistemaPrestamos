const express = require("express");
const router = express.Router();
const db = require("../db");

// db es la conexión con la BD
db
router.post("/registrarUsuario", (req, res) => {
    const id_Usuario = req.body.id_Usuario;
    const nombre_Usuario = req.body.nombre_Usuario;
    const apellidoP_Usuario = req.body.apellidoP_Usuario;
    const apellidoM_Usuario = req.body.apellidoM_Usuario;
    const correo = req.body.correo;
    const contrasenia = req.body.contrasenia;
    const id_PermisoUsuario = req.body.id_PermisoUsuario;

    db.query('SELECT * FROM usuario WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El Correo del Usuario ya existe");
        }

        db.query('INSERT INTO usuario (id_Usuario, nombre_Usuario,apellidoP_Usuario,apellidoM_Usuario,correo,contrasenia,id_PermisoUsuario) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_Usuario, nombre_Usuario, apellidoP_Usuario, apellidoM_Usuario, correo, contrasenia, id_PermisoUsuario], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Usuario registrado con éxito");
            });
    });
});

router.get("/consultarUsuario", (req, res) => {
    db.query('SELECT * FROM usuario ORDER BY id_Usuario', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});


router.put("/modificarUsuario", (req, res) => {
    const id_Usuario = req.body.id_Usuario;
    const nombre_Usuario = req.body.nombre_Usuario;
    const apellidoP_Usuario = req.body.apellidoP_Usuario;
    const apellidoM_Usuario = req.body.apellidoM_Usuario;
    const correo = req.body.correo;
    const contrasenia = req.body.contrasenia;
    const id_PermisoUsuario = req.body.id_PermisoUsuario;
    db.query('SELECT * FROM usuario WHERE correo = ? AND id_Usuario != ?', [correo, id_Usuario], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }

        if (results.length > 0) {
            return res.status(401).send("El Correo del Usuario ya existe");
        }

        db.query('UPDATE usuario SET nombre_Usuario=?, apellidoP_Usuario=?, apellidoM_Usuario=?, correo=?, contrasenia=?, id_PermisoUsuario=? WHERE id_Usuario=?',
            [nombre_Usuario, apellidoP_Usuario, apellidoM_Usuario, correo, contrasenia, id_PermisoUsuario, id_Usuario], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error interno del servidor");
                }
                res.status(200).send("Permiso de Usuario modificado con exito");
            });
    });
});

module.exports = router;