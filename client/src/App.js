import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import Inventario from './components/Inventario';
import Material from './components/Material';
import Categoria from './components/Categoria';
import Estado from './components/Estado';
import Modelo from './components/Modelo';
import Marca from './components/Marca';
import UbicacionInventario from './components/UbicacionInventario';

function App() { //NOTA: USAR EL ROUTER
  return (
    <div className="App">
      <Menu/>
      <BrowserRouter>
        <Routes>
          <Route path='/Inventario' element={<Inventario/>}/>
          <Route path ='/UbicacionInventario' element={<UbicacionInventario/>}/>
          <Route path='/Material' element={<Material/>}/>
          <Route path='/Categoria' element={<Categoria/>}/>
          <Route path='/Estado' element={<Estado/>}/>
          <Route path='/Modelo' element={<Modelo/>}/>
          <Route path='/Marca' element={<Marca/>}/>
        </Routes>
      </BrowserRouter>    
      </div>
  );
}

export default App;
