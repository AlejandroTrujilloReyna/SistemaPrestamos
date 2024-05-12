import Axios from 'axios';

const TipoSolicitanteServices = {
    registrarTipoSolicitante: (datos) => {
        return Axios.post("http://localhost:3001/tiposolicitante/registrarTipoSolicitante", datos);
    },
    consultarTipoSolicitante: () => {
        return Axios.get("http://localhost:3001/tiposolicitante/consultarTipoSolicitante");
    },
    modificarTipoSolicitante: (datos) => {
        return Axios.put("http://localhost:3001/tiposolicitante/modificarTipoSolicitante",datos);
    }
}

export default TipoSolicitanteServices;