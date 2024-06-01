import Axios from 'axios';

const PrestamoServices = {
    registrarPrestamo: (datos) => {
        return Axios.post("http://localhost:3001/prestamo/registrarPrestamo", datos);
    },
    consultarPrestamoGeneral: () => {
        return Axios.get("http://localhost:3001/prestamo/consultarPrestamoGeneral");
    },
    consultarPrestamoGeneralDevuelto: () => {
        return Axios.get("http://localhost:3001/prestamo/consultarPrestamoGeneralDevuelto");
    },
    consultarEspecifica: (datos) => {
        return Axios.get("http://localhost:3001/prestamo/consultarEspecifica",datos);
    },
    devolverPrestamo: (datos) => {
        console.log(datos);
        return Axios.put("http://localhost:3001/prestamo/DevolverPrestamo",datos);
    }
}

export default PrestamoServices;