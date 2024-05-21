import Axios from 'axios';

const SesionService = {
    consultarSesion: (datos) => {
        return Axios.post("http://localhost:3001/sesion/consultarSesion", datos);
    }     
}

export default SesionService;