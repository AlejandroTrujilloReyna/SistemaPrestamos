import React from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import {InputText} from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import SesionService from '../services/SesionService';
import { useAuth } from '../AuthContext';

const Sesion = () => {
  const [correo,setCorreo] = useState("");
  const [contrasenia,setContrasenia] = useState("");

  const toast = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const mostrarExito = (mensaje) => {
    toast.current.show({severity:'success', summary: 'Exito', detail:mensaje, life: 3000});
  }  

  const iniciar = ()=>{
    if(!correo || !contrasenia){
        mostrarExito("Existen campos vacios");
        return;
    }
    SesionService.consultarSesion({
        correo:correo,
        contrasenia:contrasenia
    }).then(response=>{
        if(response.status === 200){
            login();
            navigate('/Inicio'); 
        }
    }).catch(error=>{
        if(error.response.status === 401){
            mostrarExito("USUARIO NO REGISTRADO");
        }
    });
  }

  return (
    <div className="flex align-items-center justify-content-center h-screen">
        <Toast ref={toast} />
        <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <div className="text-center mb-5">
                <img src="/usuario.png" alt="hyper" height={90} className="mb-3" />
                <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
            </div>
            <div>
                <label htmlFor="email" className="block text-900 font-medium mb-2">Correo electronico</label>
                <InputText id="email" type="text" placeholder="Correo electronico" className="w-full mb-3"
                value={correo}
                onChange={(event)=>{
                    setCorreo(event.target.value);
                }}/>
                <label htmlFor="password" className="block text-900 font-medium mb-2">Contraseña</label>
                <InputText id="password" type="password" placeholder="Contraseña" className="w-full mb-3" 
                value={contrasenia}
                onChange={(event)=>{
                    setContrasenia(event.target.value);
                }}/>
                <Button label="Iniciar Sesion" onClick={iniciar} icon="pi pi-user" className="w-full" />
            </div>
        </div>
    </div>
  )
}

export default Sesion