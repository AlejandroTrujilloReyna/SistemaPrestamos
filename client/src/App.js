import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import PermisoUsuario from './components/PermisoUsuario';
import Usuario from './components/Usuario';import ProgramaEducativo from './components/ProgramaEducativo';
import TipoSolicitante from './components/TipoSolicitante';
function App() { //NOTA: USAR EL ROUTER
  return (
    <div className="App">
      <Menu/>
      <BrowserRouter>
        <Routes>
          <Route path='/PermisoUsuario' element={<PermisoUsuario/>}/>
          <Route path='/Usuario' element={<Usuario/>}/>
          <Route path='/ProgramaEducativo' element={<ProgramaEducativo/>}/>
          <Route path='/TipoSolicitante' element={<TipoSolicitante/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
