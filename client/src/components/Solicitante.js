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
import SolicitanteServices from '../services/SolicitanteServices';
import TipoSolicitanteServices from '../services/TipoSolicitanteServices';
import ProgramaEducativoServices from '../services/ProgramaEducativoServices';

const Solicitante = () => {
  //VARIABLES PARA EL REGISTRO  
  const [id_Solicitante,setid_Solicitante] = useState("");
  const [nombre_Solicitante,setnombre_Solicitante] = useState("");
  const [apellidoP_Solicitante, setapellidoP_Solicitante] = useState("");
  const [apellidoM_Solicitante, setapellidoM_Solicitante] = useState("");
  const [semestre,setSemestre] = useState("");
  const [activo, setActivo] = useState("");
  const [id_TipoSolicitante, setid_TipoSolicitante] = useState(null);
  const [id_ProgramaEducativo, setid_ProgramaEducativo] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [solicitantesList,setsolicitantesList] = useState([]);
  const [filtroSolicitante, setfiltroSolicitante] = useState([]);
  const [tiposSolicitantes, setTiposSolicitantes] = useState([]);  
  const [ProgramasEducativos, setProgramasEducativos] = useState([]);  
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
    if (!id_Solicitante || !nombre_Solicitante || !apellidoP_Solicitante || !apellidoM_Solicitante || !semestre || !activo || !id_TipoSolicitante || !id_ProgramaEducativo) {      
      mostrarAdvertencia("Existen Obligatorios campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    SolicitanteServices.registrarSolicitante({
        id_Solicitante:id_Solicitante,
        nombre_Solicitante:nombre_Solicitante,
        apellidoP_Solicitante:apellidoP_Solicitante,
        apellidoM_Solicitante:apellidoM_Solicitante,
        semestre:semestre,
        activo:activo,
        id_TipoSolicitante:id_TipoSolicitante,
        id_ProgramaEducativo:id_ProgramaEducativo
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("ID ya existente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    SolicitanteServices.consultarSolicitante().then((response)=>{//CASO EXITOSO
      setsolicitantesList(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    SolicitanteServices.modificarSolicitante(rowData).then((response)=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Modificación Exitosa");        
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        mostrarError("Error del sistema");
      }
    });
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setid_Solicitante("");
    setnombre_Solicitante("");    
    setapellidoP_Solicitante("");
    setapellidoM_Solicitante("");
    setSemestre("");
    setActivo("");    
    setid_TipoSolicitante(null);    
    setid_ProgramaEducativo(null);
  } 

  //!!!EXTRAS DE CONSULTA
  
  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'id_Solicitante', header: 'Id' },
    {field: 'nombre_Solicitante', header: 'Nombre' },
    {field: 'apellidoP_Solicitante', header: 'Apellido P' },
    {field: 'apellidoM_Solicitante', header: 'Apellido M' },
    {field: 'semestre', header: 'Semestre' },
    {field: 'activo', header: 'Activo' },
    {field: 'id_TipoSolicitante', header: 'Tipo' },
    {field: 'id_ProgramaEducativo', header: 'Programa Educativo' }    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  },[]);
  
  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = solicitantesList.filter((item) => {        
        const nombre_ProgramaE = ProgramasEducativos.find(p => p.id_ProgramaEducativo === item.id_ProgramaEducativo)?.nombre_ProgramaEducativo || '';    
        const nombre_TipoSol = tiposSolicitantes.find(p => p.id_TipoSolicitante === item.id_TipoSolicitante)?.nombre_TipoSolicitante || '';    
        return (
            item.id_Solicitante.toString().includes(value) ||
            item.nombre_Solicitante.toLowerCase().includes(value) ||
            item.apellidoP_Solicitante.toLowerCase().includes(value) ||
            item.apellidoM_Solicitante.toLowerCase().includes(value) ||
            item.semestre.toString().includes(value) ||            
            item.id_ProgramaEducativo.toString().includes(value) ||
            nombre_TipoSol.toLowerCase().includes(value) ||           
            nombre_ProgramaE.toLowerCase().includes(value)
        );
    });
    setfiltroSolicitante(filteredData);
  };  

  
  //MANDAR A LLAMAR A LA LISTA DE TIPO SOLICITANTE
  useEffect(() => {
    TipoSolicitanteServices.consultarTipoSolicitante()
      .then(response => {
        setTiposSolicitantes(response.data);
      })
      .catch(error => {
        console.error("Error fetching Tipo Solicitante:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE PROGRAMA EDUCATIVO
  useEffect(() => {
    ProgramaEducativoServices.consultarProgramaEducativo()
      .then(response => {
        setProgramasEducativos(response.data);
      })
      .catch(error => {
        console.error("Error fetching permiso Programa Educativo:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE LA INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_TipoSolicitante') {
      const tip = tiposSolicitantes.find((tip) => tip.id_TipoSolicitante === rowData.id_TipoSolicitante);
      return tip ? `${tip.nombre_TipoSolicitante}` : '';
    }if (field === 'id_ProgramaEducativo') {
        const prog = ProgramasEducativos.find((prog) => prog.id_ProgramaEducativo === rowData.id_ProgramaEducativo);
        return prog ? `${prog.id_ProgramaEducativo} - ${prog.nombre_ProgramaEducativo}` : '';
    }else {
      return rowData[field];
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    seteditando(true);
    switch(options.field){
      case 'id_TipoSolicitante':
        return TipoSolicitanteEditor(options);        
      case 'id_ProgramaEducativo':
        return ProgramaEducativoEditor(options);
      case 'semestre':
        return numberEditor(options);
      case 'activo':
        return numberEditor(options);
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

  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="pint"  type="text" maxLength={1} value={options.value} 
    onChange={(e) => { 
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };

    //EDITAR DROPDOWN (TIPO SOLICITANTE)
  const TipoSolicitanteEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={tiposSolicitantes}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.nombre_TipoSolicitante}`}
            optionValue="id_TipoSolicitante" // Aquí especificamos que id_TipoSolicitante se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Tipo"             
        />
    );
  };
  
  //EDITAR DROPDOWN (PROGRAMA EDUCATIVO)
  const ProgramaEducativoEditor = (options) => {
    return (
        <Dropdown
            value={options.value}
            options={ProgramasEducativos}
            onChange={(e) => options.editorCallback(e.value)}            
            optionLabel = {(option) => `${option.id_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
            optionValue="id_ProgramaEducativo" // Aquí especificamos que id_ProgramaEducativo se utilice como el valor de la opción seleccionada
            placeholder="Seleccione un Programa Educativo"             
        />
    );
  };
  

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {            
      let { rowData, newValue, field, originalEvent: event } = e;                          
      switch (field) {
        case 'nombre_Solicitante':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'apellidoP_Solicitante':
            if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'apellidoM_Solicitante':          
          if (newValue.trim().length > 0 && newValue !== rowData[field]){                                    
                rowData[field] = newValue;               
                put(rowData);                       
          }else{                             
            event.preventDefault();
          } 
          break;
        case 'semestre':
            if (newValue > 0 && newValue !== null && newValue !== rowData[field]){                                    
                  rowData[field] = newValue;               
                  put(rowData);                       
            }else{                             
              event.preventDefault();
            } 
            break;
        case 'activo':
            if (newValue > 0 && newValue !== null && newValue !== rowData[field]){                                    
                  rowData[field] = newValue;               
                  put(rowData);                       
            }else{                             
              event.preventDefault();
            } 
            break;
        case 'id_TipoSolicitante':
            if (newValue > 0 && newValue !== null && newValue !== rowData[field]){                                    
                  rowData[field] = newValue;               
                  put(rowData);                       
            }else{                             
              event.preventDefault();
            } 
            break;
        case 'id_ProgramaEducativo':
            if (newValue > 0 && newValue !== null && newValue !== rowData[field]){                                    
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
      <Panel header="Registrar Solicitante" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">          
            <div className="field col-2">
                <label>Id</label>
                <InputText type="text" keyfilter={/^[0-9]*$/} value={id_Solicitante} maxLength={10}
                    onChange={(event)=>{
                        if (validarNumero(event.target.value)) {
                        setid_Solicitante(event.target.value);
                        }
                    }} 
                    placeholder="Ej.01173367" 
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
            </div>
          <div className="field col-4">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={nombre_Solicitante} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setnombre_Solicitante(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Juan" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-4">
              <label>Apellido Paterno</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={apellidoP_Solicitante} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setapellidoP_Solicitante(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Perez" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>
          <div className="field col-4">
              <label>Apellido Materno</label>
              <InputText type="text" keyfilter={/[a-zA-ZñÑ\s]/} value={apellidoM_Solicitante} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {
                      setapellidoM_Solicitante(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Perez" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div>
          <div className="field col-2">
                <label>Id</label>
                <InputText type="text" keyfilter={/^[0-9]*$/} value={semestre} maxLength={1}
                    onChange={(event)=>{
                        if (validarNumero(event.target.value)) {
                        setSemestre(event.target.value);
                        }
                    }} 
                    placeholder="Ej.6" 
                className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
            </div>
          <div className="field col-3">
              <label>Activo</label>
              <InputText type="text" keyfilter={/^[0-9]*$/} value={activo} maxLength={1}
                  onChange={(event)=>{
                    if (validarNumero(event.target.value)) {
                    setActivo(event.target.value);
                    }
                }}   
                  placeholder="Ej.1" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"/>              
          </div> 
          <div className="field col-3">
              <label>Tipo Solicitante</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={id_TipoSolicitante} 
              options={tiposSolicitantes} 
              onChange={(e) => {
                setid_TipoSolicitante(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.nombre_TipoSolicitante}`}
              optionValue="id_TipoSolicitante" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Tipo"               
            />
          </div>
          <div className="field col-3">
              <label>Programa Educativo</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={id_ProgramaEducativo} 
              options={ProgramasEducativos} 
              onChange={(e) => {
                setProgramasEducativos(e.value);
              }} 
              //optionLabel="nombre_ProgramaEducativo" 
              optionLabel = {(option) => `${option.id_ProgramaEducativo} - ${option.nombre_ProgramaEducativo}`}
              optionValue="id_TipoSolicitante" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Programa Educativo"               
            />
          </div>
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>                
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Solicitante" className='mt-3' toggleable>
        <div className="mx-8 mb-4">
          <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
        </div>
        <DataTable value={filtroSolicitante.length ? filtroSolicitante :solicitantesList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '10%' }} editor={field === 'id_Solicitante' ? null : (options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              body={(rowData) => renderBody(rowData, field)} // Llama a la función renderBody para generar el cuerpo de la columna
              />;
          })}
        </DataTable>          
      </Panel>     
    </>
  )
}

export default Solicitante