import Axios from 'axios';

const UbicacionInventarioService = {
    registrarUbicacionInventario: (datos) => {
        return Axios.post("http://localhost:3001/ubicacioninventario/registrarUbicacionInventario", datos);
    },
    consultarUbicacionInventario:() => {
        return Axios.get("http://localhost:3001/ubicacioninventario/consultarUbicacionInventario");
    },modificarUbicacionInventario: (datos)=>{
        return Axios.put("http://localhost:3001/ubicacioninventario/modificarUbicacionInventario", datos);
    }    
}

export default UbicacionInventarioService;