import Axios from 'axios';

const MaterialPrestamoServices = {    
    registrarMaterialPrestamo: (datos) => {
        return Axios.post("http://localhost:3001/materialprestamo/registrarMaterialPrestamo", datos);
    },
    registrarMaterialPrestamoDOS: (datos) => {
        return Axios.post("http://localhost:3001/materialprestamo/registrarMaterialPrestamoDOS", datos);
    },
    consultarMaterialPrestamo: () => {
        return Axios.get("http://localhost:3001/materialprestamo/consultarMaterialPrestamo");
    },
    consultarMaterialPrestamoPrestamo: (datos) => {
        return Axios.get("http://localhost:3001/materialprestamo/consultarMaterialPrestamoPrestamo", datos);
    }
}

export default MaterialPrestamoServices;