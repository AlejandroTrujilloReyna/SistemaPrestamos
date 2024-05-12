import React from 'react'
import { Menubar } from 'primereact/menubar';

const Menu = () => {
    const items = [
        {
            label: 'Sistema de Prestamo',
        },

        {
            label: 'Permisos',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/PermisoUsuario';}
        },


        {
            label: 'Programa Educativo',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/ProgramaEducativo';}
        },

        {
            label: 'Tipo de Solicitante',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/TipoSolicitante';}
        },

        {
            label: 'Usuario',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/Usuario';}
        } 
    ];
    const start = <img alt="logo" src="/images/image.png" height="40" className="mr-2"></img>;         
  return (
    <>
        <Menubar model={items} start={start}/>                              
    </>
  )
}

export default Menu