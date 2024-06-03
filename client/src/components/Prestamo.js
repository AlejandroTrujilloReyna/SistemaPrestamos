import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import PrestamoServices from '../services/PrestamoServices';
/*import MaterialServices from '../services/MaterialServices';
import SolicitanteServices from '../services/SolicitanteServices';
import UsuarioService from '../services/UsuarioServices';
import MaterialPrestamoServices from '../services/MaterialPrestamoServices';*/

const Prestamo = () => {
  //VARIABLES ESTADO PARA LOS DIALOG, ACCIONES Y FILTRO TABLA    
  
  const [lazyState, setlazyState] = useState({
    filters: {
      id_Prestamo: { value: '', matchMode: 'startsWith' },
      fechaH_Prestamo: { value: '', matchMode: 'startsWith' },
      fechaH_Devolucion: { value: '', matchMode: 'startsWith' },
      usuario: { value: '', matchMode: 'contains' },
      solicitante: { value: '', matchMode: 'contains' },
      conjuntoMaterial: { value: '', matchMode: 'contains' }
    },
  });

  //VARIABLES PARA BUSQUEDA
  const [globalFilter, setGlobalFilter] = useState([]);
  //VARIABLES PARA LA CONSULTA   
  const [prestamoList, setprestamoList] = useState([]);  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION  
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);
  const dt = useRef(null);

  //FUNCION PARA CONSULTA
  const get = () => {
    PrestamoServices.consultarPrestamoCompletoDevuelto().then((response) => {//CASO EXITOSO
      setprestamoList(response.data);
    }).catch(error => {//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });
  }

  


  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  // Funcion para exportar en formato de excel
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  
  const leftToolbarTemplate = () => {
    return (
        <div className="flex flex-wrap gap-2">            
            <label htmlFor="NoEmpleado" className="font-bold">
              HISTORIAL
            </label>            
        </div>
    );
  };
  //Lado Derecho del Toolbar, boton Exportar
  const rightToolbarTemplate = () => {
    return (
    <React.Fragment>
      <Button label="Exportar" icon="pi pi-upload" className="p-button-help mr-5" onClick={exportCSV} />
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </IconField>
    </React.Fragment>
  );
    
  };

  //!!!EXTRAS TABLA
  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_Prestamo', header: 'Id' },
    { field: 'fechaH_Prestamo', header: 'Prestamo' },
    { field: 'fechaH_Devolucion', header: 'Devolucion' },
    { field: 'id_Usuario', header: 'Prestador', },
    { field: 'id_Solicitante', header: 'Solicitante' },
    { field: 'usuario', header: 'Prestador' },
    { field: 'solicitante', header: 'Solicitante' },    
    { field: 'conjuntoMaterial', header: 'Materiales' }
  ];

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'conjuntoMaterial' && rowData.conjuntoMaterial) {
      return rowData.conjuntoMaterial.split(',').map((unidad, index) => (
        <Tag key={index} value={unidad.trim()} className="mr-2 mb-2" />
      ));      
    } else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };

  // Funcion Necesaria para filtrado
  const onFilter = (event) => {
    event['first'] = 0;
    setlazyState(event);
  };

  return (
    <>
      {/*APARICION DE LOS MENSAJES (TOAST)*/}
      <Toast ref={toast} />
      
      {/*Barra de herramientas con boton nuevo, boton para anclar la columna de Acciones y Exportar*/}
      <Toolbar className="mt-3"  left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
      {/*Tabla de Contenido*/}
      <div className="card">
        <DataTable ref={dt} value={prestamoList} scrollable scrollHeight="400px" size='small' tableStyle={{ minWidth: '50rem' }}                
          filterDisplay="row"
          onFilter={onFilter} 
          filters={lazyState.filters}
          globalFilter={globalFilter}
          >
            
          {columns.map(({ field, header }) => {
            if (field === 'id_Prestamo' || field === 'id_Usuario' || field === 'id_Solicitante') {
              return null;
            }
            return <Column sortable key={field} field={field} header={header} style={{ width: '20%' }} body={(rowData) => renderBody(rowData, field)}
            filter/>;
          })}          
        </DataTable>
      </div>
    </>
  )
}

export default Prestamo