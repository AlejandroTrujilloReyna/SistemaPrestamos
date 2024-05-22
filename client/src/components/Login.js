import "../css/login.css";
import LscLogo from "../images/lsc-logo.png";
import UabcRectoria from "../images/lab.jpg";
import LoginServices from "../services/LoginServices";
import { useState } from "react";
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';

const Login = () => {
  const [email, setemail] = useState("");
  const [password, setpwd] = useState("");

  const validar = () => {
    LoginServices.ingreso({
      email: email,
      pwd: password
    }).then((response) => {
      if (response.status === 200) {
        const usuario = response.data[0]; // Accede al primer usuario en los resultados
        sessionStorage.setItem('id', JSON.stringify(usuario.id_Usuario)); // Convierte el id a una cadena antes de guardarlo
        sessionStorage.setItem('data', JSON.stringify(usuario)); // Convierte el objeto usuario a una cadena antes de guardarlo
        window.location.href = '/Usuario';
      }

    }).catch(error => { //Excepciones
      if (error.status === 401) {

      } else if (error.status === 402) {

      }
    })
  }

  return (
    <>
      <div className="container-main">
        <div className="container">
          <img className="imagen-fim" src={LscLogo} alt="Logo FIM" />
          <h1>Bienvenido de nuevo</h1>
          <form className="contenedor-formulario" action="">
            <label>Email</label>
            <InputText
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="inputsFormulario"
              placeholder="Ingresa tu email"
            />

            <label>Password</label>
            <Password
              value={password}
              onChange={(e) => setpwd(e.target.value)}
              feedback={false}
              tabIndex={1}
              className="inputsPwd"
              placeholder="*********"
              toggleMask />



            <div>
              <input
                className="checkboxFormulario"
                type="checkbox"
                name=""
                id=""
              />
              <span className="span-recordatorio">Recordarme por 30 días</span>

            </div>

            <button className="boton-inicio-sesion" onClick={validar}>Iniciar sesion</button>

          </form>
        </div>

        <div className="container-uabcRectoria">
          <img className="imagen-uabcRectoria" src={UabcRectoria} alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;
