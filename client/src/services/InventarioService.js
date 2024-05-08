import Axios from 'axios';

const InventarioService = {
    registrarInventario: (datos) => {
        return Axios.post("http://localhost:3001/inventario/registrarInventario", datos);
    },
    consultarInventario:() => {
        return Axios.get("http://localhost:3001/inventario/consultarInventario");
    },modificarInventario: (datos)=>{
        return Axios.put("http://localhost:3001/inventario/modificarInventario", datos);
    }        
}

export default InventarioService;