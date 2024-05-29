import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import Inventario from './components/Inventario';
import UbicacionInventario from './components/UbicacionInventario';
import Marca from './components/Marca';
import Categoria from './components/Categoria';
import UbicacionMaterial from './components/UbicacionMaterial';
import Material from './components/Material';
import Modelo from './components/Modelo';
import Estado from './components/Estado';

function App() { //NOTA: USAR EL ROUTER
  return (
    <div className="App">
      <Menu/>
      <BrowserRouter>
        <Routes>
          <Route path='/Inventario' element={<Inventario/>}/>
          <Route path ='/UbicacionInventario' element={<UbicacionInventario/>}/>
          <Route path ='/Marca' element={<Marca/>}/>
          <Route path ='/Categoria' element={<Categoria/>}/>
          <Route path ='/UbicacionMaterial' element={<UbicacionMaterial/>}/>
          <Route path ='/Material' element={<Material/>}/>
          <Route path ='/Modelo' element={<Modelo/>}/>
          <Route path ='/Estado' element={<Estado/>}/>

        </Routes>
      </BrowserRouter>    
      </div>
  );
}

export default App;
