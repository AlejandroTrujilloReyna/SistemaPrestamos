import Axios from 'axios';

const MaterialServices = {
    
    consultarMaterial: () => {
        return Axios.get("http://localhost:3001/material/consultarMaterial");
    },
    consultarMaterialSinPrestar: () => {
        return Axios.get("http://localhost:3001/material/consultarMaterialSinPrestar");
    }
}

export default MaterialServices;