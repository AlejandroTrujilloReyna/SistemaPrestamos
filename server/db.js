const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"dbsistemaprestamo"
});

db.connect((err) => {
    if (err) {
        console.error("Error de conexión a la base de datos:", err);
        return;
    }
    console.log("Conexión establecida con la base de datos");
});

module.exports = db;