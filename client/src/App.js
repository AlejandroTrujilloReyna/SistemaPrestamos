import './App.css';
import { BrowserRouter, Routes, Route, useLocation} from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import PermisoUsuario from './components/PermisoUsuario';
import Usuario from './components/Usuario'; 
import ProgramaEducativo from './components/ProgramaEducativo';
import TipoSolicitante from './components/TipoSolicitante';
import Solicitante from './components/Solicitante';
import Prestamo from './components/Prestamo';
import Login from './components/Login';

function App() {

  const isLogged = Boolean(sessionStorage.getItem('id'));
  console.log(sessionStorage.getItem('data'));
  return (
    <div className="App">
      {!isLogged && <Login/>}
      {isLogged && (
        <BrowserRouter>
          <Rutas />
        </BrowserRouter>)}

    </div>
  );
}

function Rutas() {//NOTA: USAR EL ROUTER
  let location = useLocation();
  return (
    <div className="App">
      {location.pathname !== '/Login' && <Menu />}
      <Routes>
        <Route path='/PermisoUsuario' element={<PermisoUsuario />} />
        <Route path='/Usuario' element={<Usuario />} />
        <Route path='/ProgramaEducativo' element={<ProgramaEducativo />} />
        <Route path='/TipoSolicitante' element={<TipoSolicitante />} />
        <Route path='/Solicitante' element={<Solicitante />} />
        <Route path='/Prestamo' element={<Prestamo />} />
        <Route path='/Login' element={<Login />} />
      </Routes>

    </div>
  );
}


export default App;
