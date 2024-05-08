import React from 'react'
import { Menubar } from 'primereact/menubar';

const Menu = () => {
    const items = [
        {
            label: 'Sistema Prestamo',
        },
        {
            label: 'Prestamo de Equipo',
            icon: 'pi pi-building-columns',
            //command: () => {window.location.href='/UnidadAcademica';}
        }, 
        
        {
            label: 'Historial de Prestamo',
            icon: 'pi pi-briefcase',
            //command: () => {window.location.href='/ProgramaEducativo';}
        },

        {
            label: 'Inventario',
            icon: 'pi pi-building-columns',
            //command: () => {window.location.href='/UnidadAprendizaje';}
        },                          

    ];
    const start = <img alt="logo" src="https://comunicacioninstitucional.uabc.mx/sites/default/files/inline-images/escudo-actualizado-2022.png" height="40" className="mr-2"></img>;         
  return (
    <>
        <Menubar model={items} start={start}/>                              
    </>
  )
}

export default Menu