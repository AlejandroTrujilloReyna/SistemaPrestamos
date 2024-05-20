import Axios from 'axios';

const MaterialServices = {
    
    consultarMaterial: () => {
        return Axios.get("http://localhost:3001/material/consultarMaterial");
    }
}

export default MaterialServices;