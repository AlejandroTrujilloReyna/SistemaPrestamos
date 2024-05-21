// src/services/MarcaService.js
import Axios from 'axios';

const MarcaService = {
    registrarMarca: (datos) => {
        return Axios.post("http://localhost:3001/marca/registrarMarca", datos);
    },
    consultarMarcas: () => {
        return Axios.get("http://localhost:3001/marca/consultarMarcas");
    },
    modificarMarca: (datos) => {
        return Axios.put("http://localhost:3001/marca/modificarMarca", datos);
    }

}

export default MarcaService;