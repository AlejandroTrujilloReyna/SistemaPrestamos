import Axios from 'axios';

const MarcaService = {
  registrarMarca: (datos) => {
    return Axios.post("http://localhost:3001/marca/registrarMarca", datos);
  },
  consultarMarca: () => {
    return Axios.get("http://localhost:3001/marca/consultarMarca");
  },
  modificarMarca: (datos) => {
    return Axios.put("http://localhost:3001/marca/modificarMarca", datos);
  }
}

export default MarcaService;
