// src/components/Marca.js
import React, { useState, useEffect, useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import MarcaService from '../services/MarcaService';

const Marca = () => {
  // VARIABLES PARA EL REGISTRO
  const [nombre_Marca, setNombre_Marca] = useState("");

  // VARIABLES PARA LA CONSULTA
  const [marcaList, setMarcaList] = useState([]);
  const [filtroMarca, setFiltroMarca] = useState([]);

  // VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando, setEditando] = useState(false);

  // VARIABLE PARA EL ERROR
  const toast = useRef(null);

  // MENSAJE DE EXITO
  const mostrarExito = (mensaje) => {
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: mensaje, life: 3000 });
  };

  // MENSAJE DE ADVERTENCIA
  const mostrarAdvertencia = (mensaje) => {
    toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: mensaje, life: 3000 });
  };

  // MENSAJE DE ERROR
  const mostrarError = (mensaje) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 });
  };

  // FUNCION PARA REGISTRAR
  const add = () => {
    // VALIDACION DE CAMPOS VACIOS
    if (!nombre_Marca) {
      mostrarAdvertencia("Existen campos vacíos");
      return;
    }

    // MANDAR A LLAMAR AL REGISTRO SERVICE
    MarcaService.registrarMarca({
      nombre_Marca: nombre_Marca
    }).then(response => { // CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error => { // EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      } else if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya existente");
      } else if (error.response.status === 500) {
        mostrarError("Error interno del servidor");
      }
    });
  };

  // FUNCION PARA LA CONSULTA
  const get = () => {
    MarcaService.consultarMarcas().then((response) => { // CASO EXITOSO
      setMarcaList(response.data);
    }).catch(error => { // EXCEPCIONES
      if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  };

  // FUNCION PARA LA MODIFICACION
  const put = (rowData) => {
    MarcaService.modificarMarca(rowData).then(response => { // CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación exitosa");
      }
    }).catch(error => { // EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya existente");
        get();
      } else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  };

  // FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () => {
    setNombre_Marca("");
  };

  // COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_Marca', header: 'Clave' },
    { field: 'nombre_Marca', header: 'Nombre' }
  ];

  // MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  // FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = marcaList.filter((item) => {
      return (
        item.id_Marca.toString().includes(value) ||
        item.nombre_Marca.toLowerCase().includes(value)
      );
    });
    setFiltroMarca(filteredData);
  };

  // ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    return textEditor(options);
  };

  // EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText type="text" value={options.value}
      onChange={(e) => {
        if (validarTexto(e.target.value)) {
          options.editorCallback(e.target.value)
        }
      }} onKeyDown={(e) => e.stopPropagation()} />;
  };

  // COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    switch (field) {
      // CADA CAMPO QUE SE PUEDA MODIFICAR ES UN CASO
      case 'nombre_Marca':
        if (newValue.trim().length > 0 && newValue !== rowData[field]) {
          rowData[field] = newValue;
          put(rowData);
        } else {
          event.preventDefault();
        }
        break;
      default:
        break;
    }
    setEditando(false);
  };

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabéticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return regex.test(value);
  };

  return (
    <>
      {/* APARICION  MENSAJES (TOAST) */}
      <Toast ref={toast} />
      {/*  REGISTRO */}
      <Panel header="Registrar Marca" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-10">
            <label>Nombre</label>
            <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Marca} maxLength={255}
              onChange={(event) => {
                if (validarTexto(event.target.value)) {
                  setNombre_Marca(event.target.value);
                }
              }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
          </div>
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} severity='success' />
        </div>
      </Panel>

      {/* CONSULTA DONDE SE INCLUYE LA MODIFICACION */}
      <Panel header="Consultar Marca" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
            className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />
        </div>
        <DataTable value={filtroMarca.length ? filtroMarca : marcaList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
            return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} 
            editor={field === 'nombre_Marca' ? (options) => cellEditor(options): null} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => setEditando(true)}  />;
          })}
        </DataTable>
      </Panel>
    </>
  );
}

export default Marca;
