import Axios from 'axios';

const PermisoUsuarioService = {
    registrarPermisoUsuario: (datos) => {
        return Axios.post("http://localhost:3001/edificio/registrarPermisoUsuario", datos);
    }
}

export default PermisoUsuarioService;