// src/services/ModeloService.js
import Axios from 'axios';

const ModeloService = { 
  registrarModelo: (datos) => {
    return Axios.post("http://localhost:3001/modelo/registrarModelo"), datos);
  },
  consultarModelos: () => {
    return Axios.get("http://localhost:3001/modelo/consultarModelos");
  },
  modificarModelo: (datos) => {
    return Axios.put("http://localhost:3001/modelo/modificarModelo", datos);
  }
}

export default ModeloService;
