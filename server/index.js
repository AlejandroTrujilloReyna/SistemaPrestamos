const express = require ("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const ubicacioninventarioRoutes = require("./routes/ubicacioninventario");
app.use("/ubicacioninventario", ubicacioninventarioRoutes);

const inventarioRoutes = require("./routes/inventario");
app.use("/inventario", inventarioRoutes);

const categoriaRoutes = require("./routes/categoria");
app.use("/categoria", categoriaRoutes);

const marcaRoutes = require("./routes/marca");
app.use("/marca", marcaRoutes);

const ubicacionmaterialRoutes = require("./routes/ubicacionmaterial");
app.use("/ubicacionmaterial", ubicacionmaterialRoutes);

const materialRoutes = require("./routes/material");
app.use("/material", materialRoutes);

const modeloRoutes = require("./routes/modelo");
app.use("/modelo", modeloRoutes);

const estadoRoutes = require("./routes/estado");
app.use("/estado", estadoRoutes);

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
})