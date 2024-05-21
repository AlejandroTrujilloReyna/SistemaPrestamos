const express = require ("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const sesionRoutes = require("./routes/sesion");
app.use("/sesion", sesionRoutes);

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});