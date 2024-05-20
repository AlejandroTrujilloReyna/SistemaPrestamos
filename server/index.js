const express = require ("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const permisousuarioRoutes = require("./routes/permisousuario");
app.use("/permisousuario", permisousuarioRoutes);

const usuarioRoutes = require("./routes/usuario");
app.use("/usuario", usuarioRoutes);

const programaeducativoRoutes = require("./routes/programaeducativo");
app.use("/programaeducativo", programaeducativoRoutes);

const TipoSolicitanteRoutes = require("./routes/tiposolicitante");
app.use("/tiposolicitante",TipoSolicitanteRoutes );

const solicitanteRoutes = require("./routes/solicitante");
app.use("/solicitante",solicitanteRoutes );

const prestamoRoutes = require("./routes/prestamo");
app.use("/prestamo",prestamoRoutes );

const materialRoutes = require("./routes/material");
app.use("/material",materialRoutes );
app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
})