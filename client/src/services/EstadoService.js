// src/services/EstadoService.js
import Axios from 'axios';

const EstadoService = {
    registrarEstado: (datos) => {
        return Axios.post("http://localhost:3001/estado/registrarEstado", datos);
    },
    consultarEstados: () => {
        return Axios.get("http://localhost:3001/estado/consultarEstados");
    },
    modificarEstado: (datos) => {
        return Axios.put("http://localhost:3001/estado/modificarEstado", datos);
    }        
}

export default EstadoService;
