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
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [evaluacion, setEvaluacion] = useState('');

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return regex.test(password);
  };

  const cambioCampoEmail = (i) => {
    const valor = i.target.value;
    setemail(valor);
    setErrorEmail(() => !validarEmail(valor) && valor.length > 0);
  };

  const cambioCampoPassword = (i) => {
    const valor = i.target.value;
    setpwd(valor);
    // setErrorPassword(() => !validarPassword(valor) && valor.length > 0)
  }

  const validarCampos = (e) => {
    e.preventDefault();
    if (errorEmail || errorPassword || !email || !password) {
      setEvaluacion("Por favor, corrige los errores antes de enviar.");
    }
    else {
      setEvaluacion("");
      validar();
    }
  }

  const validar = () => {
    LoginServices.ingreso({
      email: email,
      pwd: password
    }).then((response) => {
      if (response.status === 200) {
        const usuario = response.data[0]; // Accede al primer usuario en los resultados
        sessionStorage.setItem('id', JSON.stringify(usuario.id_Usuario)); // Convierte el id a una cadena antes de guardarlo
        sessionStorage.setItem('data', JSON.stringify(usuario)); // Convierte el objeto usuario a una cadena antes de guardarlo
        window.location.href='/PrestamoN';
      }

    }).catch(error => { //Excepciones
      if (error.status === 401) {
        setErrorEmail(true);
        setErrorPassword(true);
        setEvaluacion("Correo o contraseña incorrecta.");
      } else if (error.status === 402) {
        setErrorEmail(true);
        setErrorPassword(true);
        setEvaluacion("Correo o contraseña incorrecta.");
      }
    })
  }
  const isLogged = Boolean(sessionStorage.getItem('id'));
  if (isLogged) {
    sessionStorage.clear();
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
              onChange={(e) => cambioCampoEmail(e)}
              className={`inputsFormulario ${errorEmail ? "error-border" : ""}`}
              placeholder="Ingresa tu email"
            />
            <label>Password</label>
            <Password
              value={password}
              onChange={(e) => cambioCampoPassword(e)}
              feedback={false}
              className={`inputsPwd ${(errorPassword) ? "error-border": ""}`}
              placeholder="*********"
              toggleMask
            />
            <div>
              <input
                className="checkboxFormulario"
                type="checkbox"
              />
              <span className="span-recordatorio">Recordarme por 30 días</span>
            </div>

            <button className="boton-inicio-sesion" onClick={(e) => validarCampos(e)}>Iniciar sesion</button>
          </form>
          <br></br>
          {evaluacion && <div className="mensaje-evaluacion">{evaluacion}</div>}
        </div>

        <div className="container-uabcRectoria">
          <img className="imagen-uabcRectoria" src={UabcRectoria} alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;
