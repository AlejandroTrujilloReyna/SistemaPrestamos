import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from 'react';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import InventarioService from '../services/InventarioService';
import UbicacionInventarioService from '../services/UbicacionInventarioService';

const Inventario = () => {
  //VARIABLES PARA EL REGISTRO
  const [nombre_Inventario,setnombre_Inventario] = useState("");
  const [id_UbicacionInventario,setid_UbicacionInventario] = useState(null);
  //VARIABLES PARA LA CONSULTA
  const [inventarioList,setinventarioList] = useState([]);
  const [filtroinventario, setfiltroinventario] = useState([]);
  const [ubicacionesinventarios, setubicacionesinventarios] = useState([]);
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
    if (!id_UbicacionInventario || !nombre_Inventario) {
      mostrarAdvertencia("Existen campos Obligatorios vacíos");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    InventarioService.registrarInventario({
      nombre_Inventario:nombre_Inventario,   
      id_UbicacionInventario:id_UbicacionInventario
    }).then(response=>{
      if (response.status === 200) {//CASO EXITOSO
        mostrarExito("Registro Exitoso");
        get();
        limpiarCampos();
      }
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 400) {
        mostrarAdvertencia("Clave ya Existente");
      } else if (error.response.status === 401) {
        mostrarAdvertencia("Nombre ya Existente");      
      }else if(error.response.status === 500){          
        mostrarError("Error interno del servidor");
      }     
    });
  }  

  //FUNCION PARA CONSULTA
  const get = ()=>{
    InventarioService.consultarInventario().then((response)=>{//CASO EXITOSO
      setinventarioList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //setmensajeError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = (rowData) =>{
    InventarioService.modificarInventario(rowData).then(response=>{//CASO EXITOSO
      if(response.status === 200){
        mostrarExito("Modificación Exitosa");
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("Nombre ya Existente");
        get();
      }else if(error.response.status === 500){
        mostrarError("Error del sistema");
      }
    })
  }

  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setnombre_Inventario("");
    setid_UbicacionInventario(0);
  }
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    {field: 'id_Inventario', header: 'Clave' },
    {field: 'nombre_Inventario', header: 'Nombre' },
    {field: 'id_UbicacionInventario', header: 'Ubicacion Inventario'}    
  ];
  
  //MANDAR A LLAMAR A LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = inventarioList.filter((item) => {
        return (
            item.id_UbicacionInventario.toString().includes(value) ||
            item.id_Inventario.toString().includes(value) ||
            item.nombre_Inventario.toLowerCase().includes(value)
        );
    });
    setfiltroinventario(filteredData);
  }; 

  useEffect(() => {
    UbicacionInventarioService.consultarUbicacionInventario()
      .then(response => {
        setubicacionesinventarios(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_UbicacionInventario') {
      const unidad = ubicacionesinventarios.find((unidad) => unidad.id_UbicacionInventario === rowData.id_UbicacionInventario);
      return unidad ? `${unidad.nombre_ubicacioninventario}` : '';
    }
    else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  
  //!!!EXTRAS DE MODIFICACION

  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
      case 'nombre_Inventario':
        return textEditor(options);
      case 'id_UbicacionInventario':
        return UbicacionInventarioEditor(options);
      default:
        return textEditor(options);  
    }
  };

  //EDITAR TEXTO
  const textEditor = (options) => {
    return <InputText keyfilter={/[a-zA-Z\s]/} maxLength={255} type="text" value={options.value} 
    onChange={(e) =>{ 
      if (validarTexto(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }}
    onKeyDown={(e) => e.stopPropagation()} />;
  };
  
  //EDITAR NUMEROS
  const numberEditor = (options) => {
    return <InputText keyfilter="int"  type="text" maxLength={6} value={options.value} 
    onChange={(e) => {
      if (validarNumero(e.target.value)) { 
        options.editorCallback(e.target.value)
      }
    }} onKeyDown={(e) => e.stopPropagation()} />;
  };

  //EDITAR DROPDOWN (UNIDAD ACADEMICA)
  const UbicacionInventarioEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                value={options.value} 
                options={ubicacionesinventarios}  
                onChange={(e) => options.editorCallback(e.value)}
                optionLabel="nombre_ubicacioninventario" 
                optionValue="id_UbicacionInventario" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
                placeholder="Selecciona una Ubicacion" 
      />
    );
  };    

  //COMPLETAR MODIFICACION
  const onCellEditComplete = (e) => {
      let { rowData, newValue, field, originalEvent: event } = e;
      switch (field) {
        //CADA CAMPO QUE SE PUEDA MODIRICAR ES UN CASO
        case 'nombre_Inventario':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
            rowData[field] = newValue; put(rowData);
          }
          else{
            event.preventDefault();
          } 
          break;
        case 'id_UbicacionInventario':
          if(newValue > 0 && newValue !== null && newValue !== rowData[field]){
            rowData[field] = newValue; put(rowData);
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
      <Panel header="Registrar Inventario" className='mt-3' toggleable>
        <div className="formgrid grid mx-8 justify-content-center">
          <div className="field col-10">
              <label>Nombre*</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_Inventario} maxLength={255}
                  onChange={(event)=>{
                    if (validarTexto(event.target.value)) {  
                      setnombre_Inventario(event.target.value);
                    }
                  }}  
                  placeholder="Ej.Licenciatura en Sistemas Computacionales" 
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>              
          </div>
          <div className="field col-6">
              <label>Ubicacion Inventario*</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_UbicacionInventario} 
              options={ubicacionesinventarios} 
              onChange={(e) => {
                setid_UbicacionInventario(e.value);
              }} 
              optionLabel="nombre_ubicacioninventario" 
              optionValue="id_UbicacionInventario" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Ubicacion" 
            />
          </div>                                                                           
        </div>
        <div className="mx-8 mt-4">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
      </Panel>    
      {/*PANEL PARA LA CONSULTA DONDE SE INCLUYE LA MODIFICACION*/}
      <Panel header="Consultar Inventario" className='mt-3' toggleable>
      <div className="mx-8 mb-4">
        <InputText type="search" placeholder="Buscar..." maxLength={255} onChange={onSearch} 
        className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none w-full" />  
      </div>  
        <DataTable value={filtroinventario.length ? filtroinventario :inventarioList} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} editMode='cell' size='small' tableStyle={{ minWidth: '50rem' }}>
          {columns.map(({ field, header }) => {
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '15%' }} body={(rowData) => renderBody(rowData, field)}
              editor={field === 'id_Inventario' ? null : (options) => cellEditor(options)} onCellEditComplete={onCellEditComplete} onCellEditInit={(e) => seteditando(true)}/>;
          })}
        </DataTable>
      </Panel>  
    </>
  )
}

export default Inventario