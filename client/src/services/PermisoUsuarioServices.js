import Axios from 'axios';

const PermisoUsuarioService = {
    registrarPermisoUsuario: (datos) => {
        return Axios.post("http://localhost:3001/permisousuario/registrarPermisoUsuario", datos);
    },
    consultarPermisoUsuario: () => {
        return Axios.get("http://localhost:3001/permisousuario/consultarPermisoUsuario");
    },
    modificarPermisoUsuario: (datos) => {
        return Axios.put("http://localhost:3001/permisousuario/modificarPermisoUsuario",datos);
    }
}

export default PermisoUsuarioService;