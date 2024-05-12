import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import PermisoUsuarioService from '../services/PermisoUsuarioServices';
import UsuarioService from '../services/UsuarioServices';

const Usuario = () => {
  //VARIABLES PARA EL REGISTRO  
  const [nombre_Usuario,setnombre_Usuario] = useState("");
  const [apellidoP_Usuario, setapellidoP_Usuario] = useState("");
  const [apellidoM_Usuario, setapellidoM_Usuario] = useState("");
  const [correo,setcorreo] = useState("");
  const [contrasenia, setcontrasenia] = useState("");
  const [id_PermisoUsuario, setid_PermisoUsuario] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [usuariosList,setusuariosList] = useState([]);
  const [filtroUsuario, setfiltroUsuario] = useState([]);
  const [permisosUsuarios, setPermisosUsuarios] = useState([]);  
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
    if (!nombre_Usuario || !apellidoP_Usuario || !apellidoM_Usuario || !correo || !contrasenia || !id_PermisoUsuario) {      
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    UsuarioService.registrarUsuario({
      nombre_Usuario:nombre_Usuario,
      apellidoP_Usuario:apellidoP_Usuario,
      apellidoM_Usuario:apellidoM_Usuario,
      correo:correo,
      contrasenia:contrasenia,
      id_PermisoUsuario:id_PermisoUsuario     
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Correo ya existente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    UsuarioService.consultarUsuario().then((response)=>{//CASO EXITOSO
      setusuariosList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    UsuarioService.modificarUsuario(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 401) {
        mostrarAdvertencia("El Correo ya se encuentra registrado");
        get();
      }else if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setnombre_Usuario("");
    setapellidoP_Usuario("");    
    setapellidoM_Usuario("");
    setcorreo("");
    setcontrasenia("");    
    setid_PermisoUsuario(null);    
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'id_Usuario', header: 'Id' },
    {field: 'nombre_Usuario', header: 'Nombre' },
    {field: 'apellidoP_Usuario', header: 'Apellido P' },
    {field: 'apellidoM_Usuario', header: 'Apellido M' },
    {field: 'correo', header: 'Correo' },
    {field: 'contrasenia', header: 'Contraseña' },
    {field: 'id_PermisoUsuario', header: 'Permiso' }    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = usuariosList.filter((item) => {
    const permisoU = item.id_PermisoUsuario ? item.id_PermisoUsuario.toString() : '';    
    const nombrePermisoU = permisosUsuarios.find(p => p.id_PermisoUsuario === item.id_PermisoUsuario)?.nombre_PermisoUsuario || '';    
        return (
            item.id_Usuario.toString().includes(value) ||
            item.nombre_Usuario.toLowerCase().includes(value) ||
            item.apellidoP_Usuario.toLowerCase().includes(value) ||
            item.apellidoM_Usuario.toLowerCase().includes(value) ||
            item.correo.toLowerCase().includes(value) ||
            item.contrasenia.toLowerCase().includes(value) ||
            permisoU.toString().includes(value) ||
            nombrePermisoU.toLowerCase().includes(value)            
        );
    });
    setfiltroUsuario(filteredData);
  };  

  
  //MANDAR A LLAMAR A LA LISTA DE PERMISOS DE USUARIO
  useEffect(() => {
    PermisoUsuarioService.consultarPermisoUsuario()
      .then(response => {
        setPermisosUsuarios(response.data);
      })
      .catch(error => {
        console.error("Error fetching permiso usuarios:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_PermisoUsuario') {
      const per = permisosUsuarios.find((per) => per.id_PermisoUsuario === rowData.id_PermisoUsuario);
      return per ? `${per.id_PermisoUsuario} - ${per.nombre_PermisoUsuario}` : '';
    }else {
      return rowData[field];
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch(options.field){
      case 'id_PermisoUsuario':
        return PermisoUsuarioEditor(options);        
      case 'contrasenia':
        return contrasenaEditor(options);
      case 'correo':
        return correoEditor(options);
      default:
        return textEditor(options);
    }    
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

  //EDITAR CORREO
  const correoEditor = (options) => {
    return <InputText keyfilter="email"  type="text" maxLength={255} value={options.value} 
    onChange={(e) => { 
      if (validarCorreo(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR CONTRASEÑA
  const contrasenaEditor = (options) => {
    return <InputText type="text" maxLength={255} value={options.value} 
    onChange={(e) => {       
        options.editorCallback(e.target.value)      
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (PERMISO USUARIO)
  const PermisoUsuarioEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={permisosUsuarios}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.id_PermisoUsuario} - ${option.nombre_PermisoUsuario}`}
            optionValue="id_PermisoUsuario" // Aquí especificamos que id_PermisoUsuario se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Permiso"             
        />
    );
  };
  
  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                          
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO        
        case 'nombre_Usuario':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'apellidoP_Usuario':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'apellidoM_Usuario':          
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'correo':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'contrasenia':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
            rowData[field] = newValue;               
            put(rowData);                       
          }else{                             
            event.preventDefault();
          }
          break;
        case 'id_PermisoUsuario':
          if (newValue !== rowData[field]){             
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

  const validarCorreo = (value) => {
    // Expresión regular para validar el formato de un correo electrónico
    const regex = /^[a-zA-Z0-9\s@.]*$/;
    // Verificar si el correo coincide con la expresión regular
    return value==='' || regex.test(value);
  }; 

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Usuario" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">          
          <div className="field col-4">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setnombre_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Juan" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-4">
              <label>Apellido Paterno</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={apellidoP_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setapellidoP_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Perez" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>
          <div className="field col-4">
              <label>Apellido Materno</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={apellidoM_Usuario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setapellidoM_Usuario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Perez" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>
          <div className="field col-4">
              <label>Correo</label>
              <InputText type="text" keyfilter={/^[a-zA-Z0-9\s@.]*$/} value={correo} maxLength={255}
                  onChange={(event)=>{
                    if (validarCorreo(event.target.value)) {
                      setcorreo(event.target.value);
                    }
                  }} 
                  placeholder="Ej.perezperez@uabc.edu.mx" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-3">
              <label>Contraseña</label>
              <InputText type="text" value={contrasenia} maxLength={255}
                  onChange={(event)=>{                    
                      setcontrasenia(event.target.value);                    
                  }}  
                  placeholder="Ej.#rrHH2024" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-3">
              <label>Permiso</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={id_PermisoUsuario} 
              options={permisosUsuarios} 
              onChange={(e) => {
                setid_PermisoUsuario(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.id_PermisoUsuario} - ${option.nombre_PermisoUsuario}`}
              optionValue="id_PermisoUsuario" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Permiso"               
            />
          </div>
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Usuario" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroUsuario.length ? filtroUsuario :usuariosList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '10%' }} editor={field === 'id_Usuario' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              />;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default Usuario