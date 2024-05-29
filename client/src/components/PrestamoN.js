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

const PrestamoN = () => {
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
  //FUNCION PARA REGISTRAR
  const add = () => {
    //VALIDACION DE CAMPOS VACIOS
    if (!id_Usuario || !id_Solicitante || !MaterialSeleccionado) {
      mostrarAdvertencia("Existen Campos Obligatorios campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    PrestamoServices.registrarPrestamo({
      fechaH_Prestamo: obtenerFechaHoraActual(),
      fechaH_Devolucion: null,
      id_Usuario: id_Usuario,
      id_Solicitante: id_Solicitante
    }).then(response => {//CASO EXITOSO
      if (response.status === 200) {
        // mostrarExito("Registro Exitoso");
        // Si la respuesta contiene el ID del préstamo
        if (response.data && response.data.id_Prestamo) {
          // Obtener el ID del préstamo desde la respuesta
          //const idPrestamo = response.data.id_Prestamo;
          id_Prestamo = response.data.id_Prestamo;
          addMat();
          get();
          listamateriales();
          //setprestamoEsp(id);
          // Mostrar mensaje de éxito junto con el ID del préstamo
          //mostrarExito(`Registro Exitoso. ID del préstamo: ${id_Prestamo} ${MaterialSeleccionado[0]}`);
        }
      }
    }).catch(error => {//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("ID ya existente");
      } else if (error.response.status === 500) {
        mostrarError("Error interno del servidor");
      }
    });
  }

  const addMat = () => {
    // Validar que se haya seleccionado al menos un material
    if (!MaterialSeleccionado || MaterialSeleccionado.length === 0) {
      mostrarAdvertencia("Debe seleccionar al menos un material");
      return;
    }
    for (let i = 0; i < MaterialSeleccionado.length; i++) {
      const Prestado = 1;
      //MANDAR A LLAMAR AL REGISTRO SERVICE
      //mostrarAdvertencia("id: "+id_Material+" idp: "+id_Prestamo+" | "+MaterialSeleccionado[0]);
      MaterialPrestamoServices.registrarMaterialPrestamoDOS({
        id_Material: MaterialSeleccionado[i],
        id_Prestamo: id_Prestamo,
        Prestado: Prestado
      }).then(response => {//CASO EXITOSO
        if (response.status === 200) {
          if (i === MaterialSeleccionado.length - 1) {
            mostrarExito("Registro Exitoso");
            esconderDialog();
          }
          //get();
          //limpiarCampos();
        }
      }).catch(error => {//EXCEPCIONES
        if (error.response.status === 401) {
          mostrarAdvertencia("ID ya existente");
        } else if (error.response.status === 500) {
          mostrarError("Error interno del servidor");
        }
      });
    }
  }

  //FUNCION PARA CONSULTA
  const get = () => {
    PrestamoServices.consultarPrestamoGeneral().then((response) => {//CASO EXITOSO
      setprestamoList(response.data);
    }).catch(error => {//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });
  }

  const devolverPrestamo = (clave) => {
    PrestamoServices.devolverPrestamo({
      id_Prestamo: clave,
      fechaH_Devolucion: obtenerFechaHoraActual(),
    }
    ).then(response => {//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Devolucion Exitosa");
        get();
        listamateriales();
      }
    }).catch(error => {//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya Existente en el Edificio");
        get();
      } else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    })

  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS
  const limpiarCampos = () => {
    id_Prestamo = 0;
    setid_usuario(sessionStorage.getItem('id'));
    setid_Solicitante("");
    setMaterialSeleccionado([]);
  };



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

  //!!!EXTRAS DIALOG GUARDAR (REGISTRAR Y MODIFICAR)
  // Funcion para abrir Dialog para Registrar
  const abrirNuevo = () => {
    setFrmEnviado(false);
    setMostrarDialog(true);
    limpiarCampos();
  };

  //Funcion para esconder el Dialog de Guardado (Registrar o Modifcar)
  const esconderDialog = () => {
    setFrmEnviado(false);
    seteditando(false);
    setMostrarDialog(false);
  };

  // Funcion para contenido de Footer del Dialog Guardado
  const footerDialog = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={esconderDialog}></Button>
      <Button label="Guardar" icon="pi pi-check" onClick={add} />
    </React.Fragment>
  );


  // Funcion para exportar en formato de excel
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  //Lado Izquierdo del Toolbar, boton Nuevo y boton para congelar columna acciones
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={abrirNuevo} />
        <ToggleButton checked={accionesFrozen} onChange={(e) => setAccionesFrozen(e.value)} onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Acciones" offLabel="Acciones" />
      </div>
    );
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

  // Contenido de la columna de Acciones (Modificar y Eliminar)
  const accionesTabla = (rowData) => {
    //console.error("rowdata: "+rowData.id_Prestamo);
    return (
      <React.Fragment>
        <Button
          icon="pi pi-check-circle"
          rounded
          outlined
          className="m-1"
          onClick={() => devolverPrestamo(rowData.id_Prestamo)}
        />
      </React.Fragment>
    );
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
      {/*Dialog para Registrar y Modificar Sala*/}
      <Dialog
        visible={mostrarDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Sala"
        modal
        className="p-fluid"
        footer={footerDialog}
        onHide={esconderDialog}
      >
        <div className="formgrid grid">
          <div className="field col">
            <label htmlFor="Solicitante" className="font-bold">Solicitante*</label>
            <Dropdown
              id="Solicitante"
              value={id_Solicitante}
              options={solicitantesList}
              onChange={(e) => {
                setid_Solicitante(e.value);
              }}
              required
              optionLabel="nombre_Solicitante"
              optionValue="id_Solicitante" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Solicitante"
              className={classNames({ 'p-invalid': frmEnviado && !id_Solicitante })}
            />
            {frmEnviado && !id_Solicitante && (
              <small className="p-error">Se requiere el Solicitante.</small>
            )}
          </div>
        </div>
        <div className="field col">
          <label htmlFor="Material" className="font-bold">Material*</label>
          <MultiSelect
            id="Material"
            value={MaterialSeleccionado}
            options={materialList}
            onChange={(e) => {
              setMaterialSeleccionado(e.value);
            }}
            required
            filter
            optionLabel={(option) => `${option.id_Material} - ${option.nombre_Material}`}
            optionValue="id_Material" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
            placeholder="Seleccione los Materiales"
            className={classNames({ 'p-invalid': frmEnviado && !MaterialSeleccionado })}
          />
          {frmEnviado && !MaterialSeleccionado && (
            <small className="p-error">Se requiere el Material.</small>
          )}
        </div>
      </Dialog>
      {/*Barra de herramientas con boton nuevo, boton para anclar la columna de Acciones y Exportar*/}
      <Toolbar className="mt-3" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
      {/*Tabla de Contenido*/}
      <div className="card">
        <DataTable ref={dt} value={filtroprestamo.length ? filtroprestamo : prestamoList} scrollable scrollHeight="400px" size='small' tableStyle={{ minWidth: '50rem' }}          
          
          filters={lazyState.filters}

          header={header}>
          {columns.map(({ field, header }) => {
            return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '20%' }} body={(rowData) => renderBody(rowData, field)}
               />;
          })}
          <Column
            body={accionesTabla}
            exportable={false}
            style={{ minWidth: '15%' }}
            alignFrozen="right"
            frozen={accionesFrozen}
          ></Column>
        </DataTable>
      </div>
    </>
  )
}

export default PrestamoN