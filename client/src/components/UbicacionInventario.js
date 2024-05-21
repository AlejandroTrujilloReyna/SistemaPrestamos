import React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import UbicacionInventarioService from '../services/UbicacionInventarioService';

const UbicacionInventario = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_UbicacionInventario,setclave_UbicacionInventario] = useState(0);
  const [nombre_UbicacionInventario,setnombre_UbicacionInventario] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [ubicacioninventarioList,setubicacioninventarioList] = useState([]);
  const [filtroubicacioninventario, setfiltroubicacioninventario] = useState([]);
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando, seteditando] = useState(false);
  //VARIABLES PARA EL ERROR
  const toast = useRef(null);

  //MENSAJE DE EXITO
  const mostrarExito = (mensaje) => {
    toast.current.show({severity:'success', summary: 'Exito', detail:mensaje, life: 3000});
  }
  //MENSAJE DE ADVERTENCIA
  const mostrarAdvertencia = (mensaje) => {
      toast.current.show({severity:'warn', summary: 'Advertencia', detail:mensaje, life: 3000});
  }
  //MENSAJE DE ERROR
  const mostrarError = (mensaje) => {
    toast.current.show({severity:'error', summary: 'Error', detail:mensaje, life: 3000});
  }    

  //FUNCION PARA REGISTRAR
  const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!clave_UbicacionInventario || !nombre_UbicacionInventario) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UbicacionInventarioService.registrarUbicacionInventario({
      clave_UbicacionInventario:clave_UbicacionInventario,
      nombre_UbicacionInventario:nombre_UbicacionInventario
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro exitoso");
        //get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya existente");
      }else if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
      }else if(error.response.status === 500){
        mostrarError("Error interno del servidor");
      }     
    });
  }

  //FUNCION PARA LA CONSULTA
  /*const get = ()=>{
    UbicacionInventarioService.consultarUbicacionInventario().then((response)=>{//CASO EXITOSO
      setubicacioninventarioList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UbicacionInventarioService.modificarUbicacionInventario(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificacion exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");
        get();
      }else if(error.response.status === 401){
        mostrarError("Error del sistema");
      }
    });
  }*/

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_UbicacionInventario(0);
    setnombre_UbicacionInventario("");
  }  

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  /*const columns = [
    { field: 'clave_UbicacionInventario', header: 'Clave' },
    { field: 'nombre_UbicacionInventario', header: 'Nombre' },
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //ORDENAR LOS DATOS POR LA CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltroubicacioninventario([...ubicacioninventarioList].sort((a, b) => a.clave_UbicacionInventario - b.clave_UbicacionInventario));
  }, [ubicacioninventarioList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = ubicacioninventarioList.filter((item) => {
        return (
            item.clave_UbicacionInventario.toString().includes(value) ||
            item.nombre_UbicacionInventario.toLowerCase().includes(value)
        );
    });
    setfiltroubicacioninventario(filteredData);
  };
  
  //!!!EXTRAS DE MODIFICACION
  
  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    return textEditor(options);
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/[a-zA-Z\s]/} maxLength={255} type="text" value={options.value} 
    onChange={(e) => { 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent: event } = e;
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
        case 'nombre_UbicacionInventario':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
            rowData[field] = newValue; put(rowData);
          }
          else{
            event.preventDefault();
          } 
        break;
        default:
        break;
      }
      seteditando(false);
  };*/
  
  
  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return  regex.test(value);
  };

  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[0-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Ubicacion Inventario" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_UbicacionInventario} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setclave_UbicacionInventario(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_UbicacionInventario} maxLength={255}
                onChange={(event) => {
                  if (validarTexto(event.target.value)) {
                    setnombre_UbicacionInventario(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>                             
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} severity='success' />
        </div>        
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      
    </>
  )
}

export default UbicacionInventario