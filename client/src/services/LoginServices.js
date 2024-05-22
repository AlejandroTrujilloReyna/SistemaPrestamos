import Axios from 'axios';

const LoginServices = {
    ingreso: (datos) =>{
        return Axios.get("http://localhost:3001/login/validardatos", {params: datos});
    }
}

export default LoginServices;