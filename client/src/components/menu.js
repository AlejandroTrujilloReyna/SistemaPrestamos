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
            command: () => { window.location.href = '/PermisoUsuario'; }
        },


        {
            label: 'Programa Educativo',
            icon: 'pi pi-building-columns',
            command: () => { window.location.href = '/ProgramaEducativo'; }
        },

        {
            label: 'Tipo de Solicitante',
            icon: 'pi pi-building-columns',
            command: () => { window.location.href = '/TipoSolicitante'; }
        },

        {
            label: 'Usuario',
            icon: 'pi pi-building-columns',
            command: () => { window.location.href = '/Usuario'; }
        },
        {
            label: 'Solicitante',
            icon: 'pi pi-building-columns',
            command: () => { window.location.href = '/Solicitante'; }
        },
        {
            label: 'Prestamo',
            icon: 'pi pi-building-columns',
            command: () => { window.location.href = '/Prestamo'; }
        },
        {
            label: 'PrestamoN',
            icon: 'pi pi-building-columns',
            command: () => {window.location.href='/PrestamoN';}
        },
        {
            label: 'Cerrar session',
            icon: 'pi pi-building-columns',
            command: () => { window.location.href = '/Login'; }
        }
    ];
    const start = <img alt="logo" src="https://comunicacioninstitucional.uabc.mx/wp-content/uploads/2024/03/escudo-actualizado-2022-300ox.png" height="40" className="mr-2"></img>;
    return (
        <>
            <Menubar model={items} start={start} />
        </>
    )
}

export default Menu