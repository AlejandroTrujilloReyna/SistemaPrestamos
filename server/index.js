const express = require ("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const ubicacioninventarioRoutes = require("./routes/ubicacioninventario");
app.use("/ubicacioninventario", ubicacioninventarioRoutes);

const inventarioRoutes = require("./routes/inventario");
app.use("/inventario", inventarioRoutes);

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
})