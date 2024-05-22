import Axios from 'axios';

const UbicacionMaterialService = {
    registrarUbicacionMaterial: (datos) => {
        return Axios.post("http://localhost:3001/UbicacionMaterial/registrarUbicacionMaterial", datos);
    },
    consultarUbicacionMaterial:() => {
        return Axios.get("http://localhost:3001/UbicacionMaterial/consultarUbicacionMaterial");
    },modificarUbicacionMaterial: (datos)=>{
        return Axios.put("http://localhost:3001/UbicacionMaterial/modificarUbicacionMaterial", datos);
    }        
}

export default UbicacionMaterialService;