import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import PrestamoServices from '../services/PrestamoServices';
import MaterialServices from '../services/MaterialServices';
import SolicitanteServices from '../services/SolicitanteServices';
import UsuarioService from '../services/UsuarioServices';
import MaterialPrestamoServices from '../services/MaterialPrestamoServices';

const Prestamo = () => {
  //VARIABLES ESTADO PARA LOS DIALOG, ACCIONES Y FILTRO TABLA    
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [frmEnviado, setFrmEnviado] = useState(false);
  const [accionesFrozen, setAccionesFrozen] = useState(false);
  const [lazyState, setlazyState] = useState({
    filters: {
      id_Prestamo: { value: '', matchMode: 'startsWith' },
      fechaH_Prestamo: { value: '', matchMode: 'equals' },
      fechaH_Devolucion: { value: '', matchMode: 'equals' },
      id_Usuario: { value: '', matchMode: 'startsWith' },
      id_Solicitante: { value: '', matchMode: 'contains' }
    },
  });
  //VARIABLES PARA EL REGISTRO
  var id_Prestamo = 0;
  const [id_Usuario, setid_usuario] = useState(sessionStorage.getItem('id'));
  const [id_Solicitante, setid_Solicitante] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [solicitantesList, setsolicitantesList] = useState([]);
  const [materialList, setmaterialList] = useState([]);
  const [usuariosList, setusuariosList] = useState([]);
  const [MaterialSeleccionado, setMaterialSeleccionado] = useState(null);
  const [prestamoList, setprestamoList] = useState([]);
  const [filtroprestamo, setfiltroprestamo] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando, seteditando] = useState(false);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);
  const dt = useRef(null);

  //MENSAJE DE EXITO
  const mostrarExito = (mensaje) => {
    toast.current.show({ severity: 'success', summary: 'Exito', detail: mensaje, life: 3000 });
  }
  //MENSAJE DE ADVERTENCIA
  const mostrarAdvertencia = (mensaje) => {
    toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: mensaje, life: 3000 });
  }
  //MENSAJE DE ERROR
  const mostrarError = (mensaje) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  }

  // Función para obtener la fecha y hora actual y actualizar el estado
  const obtenerFechaHoraActual = () => {
    // Obtener la fecha y hora actual
    const fechaHora = new Date();
    // Formatear como cadena de texto en formato MySQL
    const fechaHoraMySQL = fechaHora.toISOString().slice(0, 19).replace('T', ' ');
    // Actualizar el estado con la fecha y hora actual en formato MySQL
    return fechaHoraMySQL;
  };

  //FUNCION PARA CONSULTA
  const get = () => {
    PrestamoServices.consultarPrestamoGeneralDevuelto().then((response) => {//CASO EXITOSO
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

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = prestamoList.filter((item) => {
      return (
        item.id_Prestamo.toString().toLowerCase().includes(value)
      );
    });
    setfiltroprestamo(filteredData);
  };
  const listamateriales = () => {
    // Lista Materiales
    MaterialServices.consultarMaterialSinPrestar()
      .then(response => {
        setmaterialList(response.data);
      })
      .catch(error => {
        console.error("Error fetching Material sin Prestar Registro Prestamo:", error);
      });
  }
  //MANDAR A LLAMAR A LA LISTAS NECESARIAS PARA DROPWDOWN
  useEffect(() => {
    // Lista Solicitantes
    SolicitanteServices.consultarSolicitante()
      .then(response => {
        setsolicitantesList(response.data);
      })
      .catch(error => {
        console.error("Error fetching Solicitantes Registro Prestamo:", error);
      });
      listamateriales();
    // Lista Usuarios
    UsuarioService.consultarUsuario()
      .then(response => {
        setusuariosList(response.data);
      })
      .catch(error => {
        console.error("Error fetching Material sin Prestar Registro Prestamo:", error);
      });
  }, []);

  // Funcion para exportar en formato de excel
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  
  //Lado Derecho del Toolbar, boton Exportar
  const rightToolbarTemplate = () => {
    return <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
  };

  //!!!EXTRAS TABLA
  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_Prestamo', header: 'Id' },
    { field: 'fechaH_Prestamo', header: 'Prestamo' },
    { field: 'fechaH_Devolucion', header: 'Devolucion' },
    { field: 'id_Usuario', header: 'Prestador', },
    { field: 'id_Solicitante', header: 'Solicitante' },
    { field: 'conjuntoMaterial', header: 'Materiales' }
  ];

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_Usuario') {
      const usuario = usuariosList.find((usuario) => usuario.id_Usuario === rowData.id_Usuario);
      return usuario ? `${usuario.nombre_Usuario} ${usuario.apellidoP_Usuario} ${usuario.apellidoM_Usuario}` : '';
    } else if (field === 'id_Solicitante') {
      const solicitan = solicitantesList.find((solicitan) => solicitan.id_Solicitante === rowData.id_Solicitante);
      return solicitan ? `${solicitan.nombre_Solicitante} ${solicitan.apellidoP_Solicitante} ${solicitan.apellidoM_Solicitate}` : '';
    }else if (field === 'conjuntoMaterial' && rowData.conjuntoMaterial) {
      return rowData.conjuntoMaterial.split(',').map((unidad, index) => (
        <Tag key={index} value={unidad.trim()} className="mr-2 mb-2" />
      ));      
    } else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  //Cabecera de la Tabla
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Salas</h4>

      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          //onInput={(e) => setGlobalFilter(e.target.value)}
          onInput={(e) => onSearch(e)}
          placeholder="Buscar..."
        />
      </IconField>
    </div>

  );

 

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
      <Toolbar className="mt-3"  right={rightToolbarTemplate}></Toolbar>
      {/*Tabla de Contenido*/}
      <div className="card">
        <DataTable ref={dt} value={filtroprestamo.length ? filtroprestamo : prestamoList} scrollable scrollHeight="400px" size='small' tableStyle={{ minWidth: '50rem' }}                
          filters={lazyState.filters}
          header={header}>
            
          {columns.map(({ field, header }) => {
            if (field === 'id_Prestamo') {
              return null;
            }
            return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '20%' }} body={(rowData) => renderBody(rowData, field)}
               />;
          })}          
        </DataTable>
      </div>
    </>
  )
}

export default Prestamo