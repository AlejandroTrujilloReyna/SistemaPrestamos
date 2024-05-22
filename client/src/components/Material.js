import React from 'react';
import { useState } from "react";
import { useEffect } from 'react';
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import MaterialService from '../services/MaterialService';

const Material = () => {
  //VARIABLES PARA EL REGISTRO
  const [clave_Material,setclave_Material] = useState(0);
  const [nombre_Material,setnombre_Material] = useState("");
  const [descripcion_Material,setdescripcion_Material] = useState("");
  const [permiso_Prestamo,setpermiso_Prestamo] = useState("");
  const [id_Categoria,setid_Categori] = useState(0);
  const [id_Marca,setid_Marca] = useState(0);
  const [id_Modelo,setid_Modelo] = useState(0);
  const [id_Estado,setid_Estado] = useState(0);
  const [clave_UbicacionMaterial,setclave_UbicacionMaterial] = useState(null);

  //VARIABLES PARA LA CONSULTA
  const [materialList,setmaterialList] = useState([]);
  const [filtromaterial, setfiltromaterial] = useState([]);
  const [ubicacionesMaterial, setUbicacionesMaterial] = useState([]);

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
    if (!clave_UbicacionMaterial || !clave_Material || !nombre_Material || !descripcion_Material || !permiso_Prestamo || !id_Categoria || !id_Marca || !id_Modelo || !id_Estado) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    MaterialService.registrarMaterial({
      clave_Material:clave_Material,
      nombre_Material:nombre_Material,
      descripcion_Material:descripcion_Material,
      permiso_Prestamo:permiso_Prestamo,
      id_Categoria:id_Categoria,
      id_Marca:id_Marca,
      id_Modelo:id_Modelo,
      id_Estado:id_Estado,
      clave_UbicacionMaterial:clave_UbicacionMaterial      

    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
        mostrarExito("Registro exitoso");
        get();
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
  const get = ()=>{
    MaterialService.consultarMaterial().then((response)=>{//CASO EXITOSO
      setmaterialList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    MaterialService.modificarMaterial(rowData).then(response=>{//CASO EXITOSO
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
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setclave_Material(0);
    setnombre_Material("");
    setdescripcion_Material("");
    setpermiso_Prestamo("");
    setid_Categori(0);
    setid_Marca(0);
    setid_Modelo(0);
    setid_Estado(0);
    setclave_UbicacionMaterial(0);
  }  

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'clave_Material', header: 'Clave' },
    { field: 'nombre_Material', header: 'Nombre' },
    { field: 'descripcion_Material', header: 'Descripcion'},
    { field: 'permiso_Prestamo', header: 'Permiso Prestamo'},
    { field: 'id_Categoria', header: 'Categoria'},
    { field: 'id_Marca', header: 'Marca'},
    { field: 'id_Modelo', header: 'Modelo'},
    { field: 'id_Estado', header: 'Estado'},
    { field: 'clave_UbicacionMaterial', header: 'Ubicacion Material' }
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //ORDENAR LOS DATOS POR LA CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltromaterial([...materialList].sort((a, b) => a.clave_Material - b.clave_Material));
  }, [materialList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = materialList.filter((item) => {
        return (
            item.clave_Material.toString().includes(value) ||
            item.nombre_Material.toLowerCase().includes(value) ||
            item.descripcion_Material.toLowerCase().includes(value) ||
            item.permiso_Prestamo.toLowerCase().includes(value) ||
            item.id_Categoria.toLowerCase().includes(value) ||
            item.id_Marca.toLowerCase().includes(value) ||
            item.id_Modelo.toLowerCase().includes(value) ||
            item.id_Estado.toLowerCase().includes(value)
        );
    });
    setfiltromaterial(filteredData);
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
        case 'nombre_Material':
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
  };
  
  
  //!!!EXTRAS CAMPOS

  const validarTexto = (value) => {
    // Expresión regular para validar caracteres alfabeticos y espacios
    const regex = /^[a-zA-Z\s]*$/;
    // Verificar si el valor coincide con la expresión regular
    return  regex.test(value);
  };

  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[1-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Material" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
          <div className="field col-2">
              <label>Clave</label>
              <InputText type="text" keyfilter="pint" value={clave_Material} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setclave_Material(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-10">
              <label>Nombre</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Material} maxLength={255}
                onChange={(event) => {
                  if (validarTexto(event.target.value)) {
                    setnombre_Material(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>     
          <div className="field col-2">
              <label>Descripcion</label>
              <InputText type="text" keyfilter="pint" value={descripcion_Material} maxLength={10}
                onChange={(event) => {
                  if (validarTexto(event.target.value)) {
                    setdescripcion_Material(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>                        
          <div className="field col-2">
              <label>Permiso Prestamo</label>
              <InputText type="text" keyfilter="pint" value={permiso_Prestamo} maxLength={10}
                onChange={(event) => {
                  if (validarTexto(event.target.value)) {
                    setpermiso_Prestamo(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Categoria</label>
              <InputText type="text" keyfilter="pint" value={id_Categoria} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setid_Categori(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Marca</label>
              <InputText type="text" keyfilter="pint" value={id_Marca} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setid_Marca(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Modelo</label>
              <InputText type="text" keyfilter="pint" value={id_Modelo} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setid_Modelo(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-2">
              <label>Estado</label>
              <InputText type="text" keyfilter="pint" value={id_Estado} maxLength={10}
                onChange={(event) => {
                  if (validarNumero(event.target.value)) {
                    setid_Estado(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-6">
              <label>Ubicacion Material</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={clave_UbicacionMaterial} 
              options={ubicacionesMaterial} 
              onChange={(e) => {
                setclave_UbicacionMaterial(e.value);
              }} 
              optionLabel="nombre_UnidadAcademica" 
              optionValue="clave_UnidadAcademica" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una unidad académica" 
            />
          </div> 
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} severity='success' />
        </div>        
      </Panel>
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Material" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtromaterial.length ? filtromaterial :materialList} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} editor={field === 'nombre_Material' ? (options) => cellEditor(options): null} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>              
    </>
  )
}

export default Material