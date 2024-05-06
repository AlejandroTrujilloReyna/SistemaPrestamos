const express = require ("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

//NOTA: PASAR LO DE MYSQL A LOS ARCHIVOS ROUTES CUANDO SE CREEN
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:""
})

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
})