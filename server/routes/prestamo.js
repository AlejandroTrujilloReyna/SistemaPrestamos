const express = require("express");
const router = express.Router();
const db = require("../db");

// db es la conexión con la BD
db//AS m JOIN conjuntomaterialprestamo AS cmp ON m.id_Material = cmp.id_Material WHERE m.permiso_Prestamo = 1 AND (cmp.id_Material IS NULL OR cmp.prestado= 0    
router.post("/registrarPrestamo", (req, res) => {
    const id_Prestamo = null;//req.body.id_Prestamo;
    const fechaH_Prestamo = req.body.fechaH_Prestamo;
    const fechaH_Devolucion = req.body.fechaH_Devolucion;
    const id_Usuario = req.body.id_Usuario;
    const id_Solicitante = req.body.id_Solicitante;
    db.query('INSERT INTO prestamo (id_Prestamo, fechaH_Prestamo,fechaH_Devolucion,id_Usuario,id_Solicitante) VALUES (?, ?, ?, ?, ?)',
        [id_Prestamo, fechaH_Prestamo, fechaH_Devolucion, id_Usuario, id_Solicitante], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            const id_Prestamo = result.insertId;
            //res.status(200).send("Prestamo Registrado con éxito ");
            res.status(200).json({ id_Prestamo: id_Prestamo, message: "Prestamo registrado con éxito" });
        });
});

router.get("/consultarPrestamoGeneral", (req, res) => {
    db.query('SELECT * FROM prestamo ORDER BY id_Prestamo', (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.get("/consultarEspecifica", (req, res) => {
    const fechaH_Prestamo = req.body.fechaH_Prestamo;
    const fechaH_Devolucion = req.body.fechaH_Devolucion;
    const id_Usuario = req.body.id_Usuario;
    const id_Solicitante = req.body.id_Solicitante;
    db.query('SELECT * FROM prestamo WHERE fechaH_Prestamo =? AND fechaH_Devolucion AND id_Usuario=? AND id_Solicitante=?',
        [fechaH_Prestamo, fechaH_Devolucion, id_Usuario, id_Solicitante], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).json(results);
        });
});


router.put("/modificarPrestamo", (req, res) => {
    const id_Prestamo = req.body.id_Prestamo;
    //const fechaH_Prestamo = req.body.fechaH_Prestamo;
    const fechaH_Devolucion = req.body.fechaH_Devolucion;
    //const id_Usuario = req.body.id_Usuario;
    //const id_Solicitante = req.body.id_Solicitante;
    db.query('UPDATE prestamo SET fechaH_Devolucion=? WHERE id_Prestamo=?',
        [fechaH_Devolucion, id_Prestamo], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error interno del servidor");
            }
            res.status(200).send("Prestamo modificado con exito");
        });
});

module.exports = router;