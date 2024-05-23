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

        </Routes>
      </BrowserRouter>    
      </div>
  );
}

export default App;
