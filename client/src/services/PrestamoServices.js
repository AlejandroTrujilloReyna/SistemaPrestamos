import Axios from 'axios';

const PrestamoServices = {
    registrarPrestamo: (datos) => {
        return Axios.post("http://localhost:3001/prestamo/registrarPrestamo", datos);
    },
    consultarPrestamoGeneral: () => {
        return Axios.get("http://localhost:3001/prestamo/consultarPrestamoGeneral");
    },
    consultarEspecifica: (datos) => {
        return Axios.get("http://localhost:3001/prestamo/consultarEspecifica",datos);
    },
    modificarPrestamo: (datos) => {
        return Axios.put("http://localhost:3001/prestamo/modificarPrestamo",datos);
    }
}

export default PrestamoServices;