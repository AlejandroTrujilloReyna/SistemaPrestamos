import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import 'primereact/resources/themes/arya-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';


import Inicio from './pages/Inicio';
import Sesion from './pages/Sesion';

import ProtectedRoute from './ProtectedRoute';


function App() {
  return (
    <div className="App">
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RutaPrincipal/>}/>
          <Route path='/Inicio' element={<ProtectedRoute><Inicio/></ProtectedRoute>}/>
          <Route path='/Sesion' element={<Sesion/>}/>
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

const RutaPrincipal = () => {
  const { isAuthenticated } = useAuth(); // Obtiene el estado de autenticación del contexto de autenticación
  // Si el usuario está autenticado, redirige a la página de inicio, de lo contrario, redirige a la página de inicio de sesión
  return isAuthenticated ? <Navigate to="/Inicio" /> : <Navigate to="/Sesion" />;
}

export default App;
