import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import ProgramaEducativoService from '../services/ProgramaEducativoServices';

const ProgramaEducativo = () => {

    //VARIABLES PARA EL REGISTRO  
  const [id_ProgramaEducativo,setid_ProgramaEducativo] = useState("");
  const [nombre_ProgramaEducativo,setnombre_ProgramaEducativo] = useState("");

  //VARIABLES PARA LA CONSULTA
  const [programaeducativoList,setprogramaeducativoList] = useState([]);
  const [filtroProgramaEducativo, setfiltroProgramaEducativo] = useState([]);  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  const [editando,seteditando] = useState(false);
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
    if (!nombre_ProgramaEducativo || !id_ProgramaEducativo) {      
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    ProgramaEducativoService.registrarProgramaEducativo({  
        id_ProgramaEducativo: id_ProgramaEducativo,      
        nombre_ProgramaEducativo:nombre_ProgramaEducativo
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya existente");        
      }else if(error.response.status === 400){
        mostrarAdvertencia("Clave ya existente");
      } else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }  


  //FUNCION PARA CONSULTA
  const get = ()=>{
    ProgramaEducativoService.consultarProgramaEducativo().then((response)=>{//CASO EXITOSO
      setprogramaeducativoList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }


  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    ProgramaEducativoService.modificarProgramaEducativo(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("El nombre ya se encuentra registrado");
        get();
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setid_ProgramaEducativo(0);
    setnombre_ProgramaEducativo("");
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'id_ProgramaEducativo', header: 'Id' },
    {field: 'nombre_ProgramaEducativo', header: 'Nombre' },      
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = programaeducativoList.filter((item) => {
        return (
            item.id_ProgramaEducativo.toString().includes(value) ||
            item.nombre_ProgramaEducativo.toLowerCase().includes(value)
        );
    });
    setfiltroProgramaEducativo(filteredData);
  };  


  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {    
    return textEditor(options);    
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={options.value} maxLength={255} 
    onChange={(e) => { 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                          
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO        
        case 'nombre_ProgramaEducativo':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;        
        default:
          break;
      }
      seteditando(false);
  }; 


  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return regex.test(value);
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
      <Panel header="Registrar Programa Educativo" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">
        <div className="field col-2">
              <label>Id</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={id_ProgramaEducativo} maxLength={11}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                      setid_ProgramaEducativo(event.target.value);
                    }
                  }} 
                  placeholder="Ej.105" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-4">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_ProgramaEducativo} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setnombre_ProgramaEducativo(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Licenciatura en Sistemas Computacionales" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>           
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Programas Educativos" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroProgramaEducativo.length ? filtroProgramaEducativo :programaeducativoList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'id_ProgramaEducativo' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}               
              />;
          })}
        </DataTable>          
      </Panel>     
    </>

)

}
export default ProgramaEducativo