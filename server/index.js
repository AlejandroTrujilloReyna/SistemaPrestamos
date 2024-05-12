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
app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
})