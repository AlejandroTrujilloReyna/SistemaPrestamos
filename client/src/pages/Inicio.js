import React from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '../AuthContext'; // Importa el contexto de autenticación

const Inicio = () => {
  const { logout } = useAuth(); // Obtiene la función de logout del contexto de autenticación

  const handleLogout = () => {
    logout(); // Llama a la función de logout cuando se hace clic en el botón
  };

  return (
    <div className="grid grid-nogutter surface-0 text-800 h-screen">
      <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center h-screen">
        <section>
          <span className="block text-6xl font-bold mb-1">Bienvenido</span>
          <div className="text-6xl text-primary font-bold mb-3">Has accedido al sistema de prestamos</div>
          <p className="mt-0 mb-4 text-700 line-height-3">Ahora podrás capturar los prestamos del equipo de laboratorio</p>
          <Button label="Cerrar Sesión" onClick={handleLogout} className="mr-3 p-button-raised" />
        </section>
      </div>
      <div className="col-12 md:col-6 overflow-hidden h-screen">
        <img src="/hero.jpg" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
      </div>
    </div>
  );
}

export default Inicio;
