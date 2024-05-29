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
import CategoriaService from '../services/CategoriaService';
import MarcaService from '../services/MarcaService';
import ModeloService from '../services/ModeloService';
import EstadoService from '../services/EstadoService';
import UbicacionMaterialService from '../services/UbicacionMaterialService'

const Material = () => {
  //VARIABLES PARA EL REGISTRO
  const [nombre_Material,setnombre_Material] = useState("");
  const [descripcion_Material,setdescripcion_Material] = useState("");
  const [permiso_Prestamo,setpermiso_Prestamo] = useState("");
  const [id_Categoria,setid_Categoria] = useState(null);
  const [id_Marca,setid_Marca] = useState(null);
  const [id_Modelo,setid_Modelo] = useState(null);
  const [id_Estado,setid_Estado] = useState(null);
  const [id_UbicacionMaterial,setid_UbicacionMaterial] = useState(null);

  //VARIABLES PARA LA CONSULTA
  const [materialList,setmaterialList] = useState([]);
  const [filtromaterial, setfiltromaterial] = useState([]);
  const [ubicacionesMaterial, setUbicacionesMaterial] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [estados, setEstados] = useState([]);

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
    if (!id_UbicacionMaterial || !nombre_Material || !descripcion_Material || !permiso_Prestamo || !id_Categoria || !id_Marca || !id_Modelo || !id_Estado) {
      mostrarAdvertencia("Existen campos vacios");
      return;
    }
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    MaterialService.registrarMaterial({
      nombre_Material:nombre_Material,
      descripcion_Material:descripcion_Material,
      permiso_Prestamo:permiso_Prestamo,
      id_Categoria:id_Categoria,
      id_Marca:id_Marca,
      id_Modelo:id_Modelo,
      id_Estado:id_Estado,
      id_UbicacionMaterial:id_UbicacionMaterial      

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
    setnombre_Material("");
    setdescripcion_Material("");
    setpermiso_Prestamo("");
    setid_Categoria(0);
    setid_Marca(0);
    setid_Modelo(0);
    setid_Estado(0);
    setid_UbicacionMaterial(0);
  }  

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_Material', header: 'Clave' },
    { field: 'nombre_Material', header: 'Nombre' },
    { field: 'descripcion_Material', header: 'Descripcion'},
    { field: 'permiso_Prestamo', header: 'Permiso Prestamo'},
    { field: 'id_Categoria', header: 'Categoria'},
    { field: 'id_Marca', header: 'Marca'},
    { field: 'id_Modelo', header: 'Modelo'},
    { field: 'id_Estado', header: 'Estado'},
    { field: 'id_UbicacionMaterial', header: 'Ubicacion Material' }
  ];

  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);

  //ORDENAR LOS DATOS POR LA CLAVE AL INGRESAR A LA PAGINA
  useEffect(() => {
    setfiltromaterial([...materialList].sort((a, b) => a.id_Material - b.id_Material));
  }, [materialList]);

  //FUNCION PARA LA BARRA DE BUSQUEDA
  const onSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredData = materialList.filter((item) => {
        return (
            item.id_Material.toString().includes(value) ||
            item.nombre_Material.toLowerCase().includes(value) ||
            item.descripcion_Material.toLowerCase().includes(value) ||
            item.permiso_Prestamo.toLowerCase().includes(value) ||
            item.id_Categoria.toString().includes(value) ||
            item.id_Marca.toString().includes(value) ||
            item.id_Modelo.toString().includes(value) ||
            item.id_Estado.toString().includes(value) ||
            item.id_UbicacionMaterial.toString().includes(value)
        );
    });
    setfiltromaterial(filteredData);
  };
  
  useEffect(() => {
    UbicacionMaterialService.consultarUbicacionMaterial()
      .then(response => {
        setUbicacionesMaterial(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  useEffect(() => {
    CategoriaService.consultarCategoria()
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  useEffect(() => {
    MarcaService.consultarMarcas()
      .then(response => {
        setMarcas(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  useEffect(() => {
    ModeloService.consultarModelos()
      .then(response => {
        setModelos(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  useEffect(() => {
    EstadoService.consultarEstados()
      .then(response => {
        setEstados(response.data);
      })
      .catch(error => {
        console.error("Error fetching:", error);
      });
  }, []);

  const renderBody = (rowData, field) => {
    if (field === 'id_UbicacionMaterial') {
      const unidad = ubicacionesMaterial.find((unidad) => unidad.id_UbicacionMaterial === rowData.id_UbicacionMaterial);
      return unidad ? `${unidad.nombre_UbicacionMaterial}` : '';
    }  if (field === 'id_Categoria') {
      const unidad = categorias.find((unidad) => unidad.id_Categoria === rowData.id_Categoria);
      return unidad ? `${unidad.nombre_Categoria}` : '';
    }  if (field === 'id_Marca') {
      const unidad = marcas.find((unidad) => unidad.id_Marca === rowData.id_Marca);
      return unidad ? `${unidad.nombre_Marca}` : '';
    }  if (field === 'id_Modelo') {
      const unidad = modelos.find((unidad) => unidad.id_Modelo === rowData.id_Modelo);
      return unidad ? `${unidad.nombre_Modelo}` : '';
    }  if (field === 'id_Estado') {
      const unidad = estados.find((unidad) => unidad.id_Estado === rowData.id_Estado);
      return unidad ? `${unidad.nombre_Estado}` : '';
    } else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };
  //!!!EXTRAS DE MODIFICACION
  
  //ACTIVAR EDICION DE CELDA
  const cellEditor = (options) => {
    switch (options.field) {
      case 'nombre_Material':
        return textEditor(options);
      case 'descripcion_Material':
        return textEditor(options);
      case 'permiso_Prestamo':
        return numberEditor(options);
      case 'id_Categoria':
        return CategoriaEditor(options);
      case 'id_Marca':
        return MarcaEditor(options);
      case 'id_Modelo':
        return ModeloEditor(options);
      case 'id_Estado':
        return EstadoEditor(options);
      case 'id_UbicacionMaterial':
        return UbicacionMaterialEditor(options);
      default:
      return textEditor(options);
    }
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
  const CategoriaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={categorias}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="nombre_Categoria" 
        optionValue="id_Categoria" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
        placeholder="Selecciona una Categoria" 
          />
        );
      }; 
      
  const MarcaEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={marcas}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="nombre_Marca" 
        optionValue="id_Marca" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
        placeholder="Selecciona una Marca" 
          />
        );
      }; 
  
  const ModeloEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={modelos}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="nombre_Modelo" 
        optionValue="id_Modelo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
        placeholder="Selecciona un Modelo" 
          />
        );
      }; 

  const EstadoEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={estados}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="nombre_Estado" 
        optionValue="id_Estado" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
        placeholder="Selecciona un Estado" 
          />
        );
      };  

  const UbicacionMaterialEditor = (options) => {
    return (
      <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
        value={options.value} 
        options={ubicacionesMaterial}  
        onChange={(e) => options.editorCallback(e.value)}
        optionLabel="nombre_ubicacionmaterial" 
        optionValue="id_UbicacionMaterial" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
        placeholder="Selecciona una UbicacionMaterial" 
          />
        );
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
        case 'descripcion_Material':
          if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
            rowData[field] = newValue; put(rowData);
          }
          else{
            event.preventDefault();
          } 
        break;        
        case 'permiso_Prestamo':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }
        else{
          event.preventDefault();
        } 
      break;        
      case 'id_Categoria':
      if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        event.preventDefault();
      } 
      break;
      case 'id_Marca':
      if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        event.preventDefault();
      } 
      break;      
      case 'id_Modelo':
      if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
        rowData[field] = newValue; put(rowData);
      }
      else{
        event.preventDefault();
      } 
      break;
      case 'id_Estado':
        if (newValue.trim().length > 0 && newValue !== rowData[field]){ 
          rowData[field] = newValue; put(rowData);
        }
        else{
          event.preventDefault();
        } 
        break;

        case 'id_UbicacionMaterial':
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
    return  regex.test(value);
  };

  const validarNumero = (value) => {
    // Expresión regular para validar números enteros positivos
    const regex = /^[1-9]\d*$/;
    // Verificar si el valor coincide con la expresión regular
    return value==='' || regex.test(value);
  };

  const validarTodo = (value) => {
    // Modificar esta expresión regular para permitir letras, números y espacios
    const regex = /^[a-zA-Z0-9\s]+$/;
    return regex.test(value);
  };

  return (
    <>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Material" className='mt-3' toggleable>
        <div className="formgrid grid mx-8">
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
              <InputText type="text" value={descripcion_Material} maxLength={100}
                onChange={(event) => {
                  if (validarTodo(event.target.value)) {
                    setdescripcion_Material(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>                        
          <div className="field col-2">
              <label>Permiso Prestamo</label>
              <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={permiso_Prestamo} maxLength={100}
                onChange={(event) => {
                  if (validarTexto(event.target.value)) {
                    setpermiso_Prestamo(event.target.value);
                  }
                }}
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"/>
          </div>
          <div className="field col-6">
              <label>Categoria</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_Categoria} 
              options={categorias} 
              onChange={(e) => {
                setCategorias(e.value);
              }} 
              optionLabel="nombre_Modelo" 
              optionValue="id_Modelo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Modelo" 
            />
          </div> 
          <div className="field col-6">
              <label>Marca</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_Marca} 
              options={marcas} 
              onChange={(e) => {
                setMarcas(e.value);
              }} 
              optionLabel="nombre_Marcas" 
              optionValue="id_Marcas" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione una Marca" 
            />
          </div> 
          <div className="field col-6">
              <label>Modelo</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_Modelo} 
              options={modelos} 
              onChange={(e) => {
                setid_Modelo(e.value);
              }} 
              optionLabel="nombre_Modelo" 
              optionValue="id_Modelo" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Modelo" 
            />
          </div> 
          <div className="field col-6">
          <label>Estado</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_Estado} 
              options={ubicacionesMaterial} 
              onChange={(e) => {
                setid_Estado(e.value);
              }} 
              optionLabel="nombre_Estado" 
              optionValue="clave_Estado" // Aquí especificamos que la clave de la unidad académica se utilice como el valor de la opción seleccionada
              placeholder="Seleccione un Estado" 
            />
          </div> 
          <div className="field col-6">
              <label>Ubicacion Material</label>
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={id_UbicacionMaterial} 
              options={ubicacionesMaterial} 
              onChange={(e) => {
                setid_UbicacionMaterial(e.value);
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
              return <Column sortable={editando === false} key={field} field={field} header={header} style={{ width: '25%' }} body ={(rowData) => renderBody(rowData,field)}
              editor={field === 'nombre_Material' ? (options) => cellEditor(options): null} onCellEditComplete={onCellEditComplete}/>;
          })}
        </DataTable>
      </Panel>              
    </>
  )
}

export default Material