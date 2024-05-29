import Axios from 'axios';

const UbicacionMaterialService = {
    registrarUbicacionMaterial: (datos) => {
        return Axios.post("http://localhost:3001/ubicacionmaterial/registrarUbicacionMaterial", datos);
    },
    consultarUbicacionMaterial:() => {
        return Axios.get("http://localhost:3001/ubicacionmaterial/consultarUbicacionMaterial");
    },modificarUbicacionMaterial: (datos)=>{
        return Axios.put("http://localhost:3001/ubicacionmaterial/modificarUbicacionMaterial", datos);
    }        
}

export default UbicacionMaterialService;