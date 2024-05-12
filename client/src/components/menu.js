import React from 'react'
import { Menubar } from 'primereact/menubar';

const Menu = () => {
    const items = [
        {
            label: 'Sistema de Inventario',
        },
        {
            label: 'Inventario',
            icon: 'pi pi-building',
            items: [
                {
                    label: 'Inventario',
                    command: () => {window.location.href='/inventario';}                 
                },                
                {
                    label: 'Ubicacion de Inventario',
                    command: () => {window.location.href='/ubicacioninventario';}                    
                },
            ]
        },

        {
            label: 'Material',
            icon: 'pi pi-building-columns',
            items: [
                {
                    label: 'Material',
                    command: () => {window.location.href='/Material';}                 
                },                
                {
                    label: 'Ubicacion de Material',
                    command: () => {window.location.href='/UbicacionMaterial';}                    
                },
            ]
        }, 

        {
            label: 'Categoria',
            icon: 'pi pi-home',
            command: () => {window.location.href='/Categoria';}

        },
        {
            label: 'Estado',
            icon: 'pi pi-home',
            command: () => {window.location.href='/Estado';}
        },                    

        {
            label: 'Modelo',
            icon: 'pi pi-home',
            command: () => {window.location.href='/Modelo';}
        },                    

         
        {
            label: 'Marca',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/Marca';}
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