import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import PrestamoServices from '../services/PrestamoServices';
import MaterialServices from '../services/MaterialServices';
import SolicitanteServices from '../services/SolicitanteServices';
import UsuarioService from '../services/UsuarioServices';
import MaterialPrestamoServices from '../services/MaterialPrestamoServices';
const Prestamo = () => {

    //VARIABLES PARA EL REGISTRO  
    let id_Prestamo=0;
  //const [fechaH_Prestamo,setfechaH_Prestamo] = useState("");
  const [fechaH_Devolucion,setfechaH_Devolucion] = useState(null);
  //const [id_Usuario,setid_Usuario] = useState("");
  const [id_Solicitante,setid_Solicitante] = useState("");
  const [id_Usuario,setid_Usuario] = useState("");
  //const [id_Material,setid_Material,] = useState("");
  //VARIABLES PARA LA CONSULTA
 // const [prestamosList,setprestamosList] = useState([]);
 // const [usuariosList,setusuariosList] = useState([]);  
  const [solicitantesList,setsolicitantesList] = useState([]);
  const [materialList,setmaterialList] = useState([]);
  const [usuariosList,setusuariosList] = useState([]);
  const [MaterialSeleccionado, setMaterialSeleccionado] = useState(null);  
  //const [filtroProgramaEducativo, setfiltroProgramaEducativo] = useState([]);  
  //VARIABLE PARA LA MODIFICACION QUE INDICA QUE SE ESTA EN EL MODO EDICION
  //const [editando,seteditando] = useState(false);
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

  //MANDAR A LLAMAR A LA LISTA DE MATERIAL 
  useEffect(() => {
    MaterialServices.consultarMaterialSinPrestar()
      .then(response => {
        setmaterialList(response.data);
      })
      .catch(error => {
        console.error("Error fetching permiso usuarios:", error);
      });
  }, []);  

  //MANDAR A LLAMAR A LA LISTA DE SOLICITANTE
  useEffect(() => {
    SolicitanteServices.consultarSolicitante()
      .then(response => {
        setsolicitantesList(response.data);
      })
      .catch(error => {
        console.error("Error fetching permiso usuarios:", error);
      });
  }, []);  
  
  //MANDAR A LLAMAR A LA LISTA DE USUARIO
  useEffect(() => {
    UsuarioService.consultarUsuario()
      .then(response => {
        setusuariosList(response.data);
      })
      .catch(error => {
        console.error("Error fetching permiso usuarios:", error);
      });
  }, []);   

//FUNCION PARA REGISTRAR
const add = ()=>{
    //VALIDACION DE CAMPOS VACIOS
    if (!id_Usuario || !id_Solicitante || !MaterialSeleccionado) {      
      mostrarAdvertencia("Existen Campos Obligatorios campos vacios");
      return;
    }    
    //MANDAR A LLAMAR AL REGISTRO SERVICE
    PrestamoServices.registrarPrestamo({
        fechaH_Prestamo:obtenerFechaHoraActual(),
        fechaH_Devolucion:null,
        id_Usuario:id_Usuario,
        id_Solicitante:id_Solicitante        
    }).then(response=>{//CASO EXITOSO
      if (response.status === 200) {
       // mostrarExito("Registro Exitoso");
        // Si la respuesta contiene el ID del préstamo
        if (response.data && response.data.id_Prestamo) {
            // Obtener el ID del préstamo desde la respuesta
            //const idPrestamo = response.data.id_Prestamo;
            id_Prestamo = response.data.id_Prestamo;            
            //setprestamoEsp(id);
            // Mostrar mensaje de éxito junto con el ID del préstamo
            mostrarExito(`Registro Exitoso. ID del préstamo: ${id_Prestamo} ${MaterialSeleccionado[0]}`);
        }
      }
    }).catch(error=>{//EXCEPCIONES
      if(error.response.status === 401){
        mostrarAdvertencia("ID ya existente");        
      }else if(error.response.status === 500){  
        mostrarError("Error interno del servidor");
      }     
    });
    
    // CONSULTA PARA SABER EL ID DEL PRESTAMO ACTUAL
    /*PrestamoServices.consultarEspecifica({
        fechaH_Prestamo:fechaH_Prestamo,
        fechaH_Devolucion:fechaH_Devolucion,
        id_Usuario:id_Usuario,
        id_Solicitante:id_Solicitante        
    }).then((response)=>{//CASO EXITOSO
        console.error(response.data);
        setprestamoEsp(response.data);      
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    }); */
        
  } 

  const addMat = ()=>{
    // Validar que se haya seleccionado al menos un material
    if (!MaterialSeleccionado || MaterialSeleccionado.length === 0) {
        mostrarAdvertencia("Debe seleccionar al menos un material");
        return;
    }
    for (let i = 0; i < MaterialSeleccionado.length; i++) {
        let id_Material = MaterialSeleccionado[i];
        const Prestado = 1;
        //MANDAR A LLAMAR AL REGISTRO SERVICE
        mostrarAdvertencia("id: "+id_Material+" idp: "+id_Prestamo+" | "+MaterialSeleccionado[0]);
        MaterialPrestamoServices.registrarMaterialPrestamoDOS({
          id_Material:MaterialSeleccionado[i],
            id_Prestamo:id_Prestamo,
            Prestado:Prestado     
        }).then(response=>{//CASO EXITOSO
        if (response.status === 200) {
            mostrarExito("Registro Exitoso");
            //get();
            //limpiarCampos();
        }
        }).catch(error=>{//EXCEPCIONES
        if(error.response.status === 401){
            mostrarAdvertencia("ID ya existente");        
        }else if(error.response.status === 500){  
            mostrarError("Error interno del servidor");
        }     
        });
    }
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

return (
<>
    {/*APARICION DE LOS MENSAJES (TOAST)*/}
    <Toast ref={toast} />
      {/*PANEL PARA EL REGISTRO*/}
      <Panel header="Registrar Programa Educativo" className='mt-3' toggleable>        
        <div className="formgrid grid mx-8 justify-content-center">
        <div className="field col-3">
          <label>Usuario</label>          
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={id_Usuario} 
              options={usuariosList} 
              onChange={(e) => {
                setid_Usuario(e.value);
              }}    
              filter           
              optionLabel = {(option) => `${option.id_Usuario} - ${option.nombre_Usuario}`}
              optionValue="id_Usuario" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
              placeholder="Seleccione al Usuario"               
            />
        </div>
        <div className="field col-3">
          <label>Solicitante</label>          
            <Dropdown className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={id_Solicitante} 
              options={solicitantesList} 
              onChange={(e) => {
                setid_Solicitante(e.value);
              }}    
              filter           
              optionLabel = {(option) => `${option.id_Solicitante} - ${option.nombre_Solicitante}`}
              optionValue="id_Solicitante" // Aquí especificamos que la clave del permiso se utilice como el valor de la opción seleccionada
              placeholder="Seleccione al Solicitante"               
            />
        </div>    
        <div className="field col-5">
          <label>Material</label>
            <MultiSelect className="text-base text-color surface-overlay p-0 m-0 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full custom-input-text"
              value={MaterialSeleccionado} 
              options={materialList} 
              onChange={(e) => {
                setMaterialSeleccionado(e.value);
              }}    
              filter           
              optionLabel = {(option) => `${option.id_Material} - ${option.nombre_Material}`}
              optionValue="id_Material" // Aquí especificamos que la clave del Material se utilice como el valor de la opción seleccionada
              placeholder="Seleccione al Solicitante"               
            />
        </div>          
        <div className="field col-3">            
            <label>{fechaH_Devolucion}</label>
            <Button label="Fecha Devolucion" onClick={() => setfechaH_Devolucion(obtenerFechaHoraActual())} className="p-button-success" />
        </div>
        <div className="field col-8">
          <Button label="Guardar" onClick={add} className="p-button-success" />
        </div>   
        <div className="field col-8">
          <Button label="Guardar" onClick={addMat} className="p-button-success" />
        </div>           
        </div>
        <div className="mx-8 mt-4">
         {/* <Button label="Guardar" onClick={add} className="p-button-success" />*/}
        </div>                
      </Panel>      
    </>

)

}
export default Prestamo