import React, { Fragment, useEffect } from "react";
import axios from "axios";
import { useState, useReducer } from "react";
import Select from "react-select";

export default function DetallesTareaEmpleados({ AccionID }) {
  //Reducers
  const [aReducerEmpleados, dispatchReducerEmpleados] = useReducer(
    (state = [], action) => {
      switch (action.type) {
        case "initialize_empleados": {
          if (state.filter((i) => i.Codigo === action.payload.Codigo) !== 0)
            return [
              ...state,
              {
                index: state.length,
                Codigo: {
                    value: action.payload.ID, 
                    label: `${action.payload.Codigo} | ${action.payload.Nombre} ${action.payload.Apellidos}`
                },
                AccionTiempo: action.payload.AccionTiempo,
              },
            ];
          else {
            return state;
          }
        }

        case "addEmpleado": {
          return [
            ...state,
            {
              index: state.length,
              Codigo: "vacio",
              AccionTiempo: "00:00",
            },
          ];
        }

        case 'clearAll':{
          return state.filter(i => i.index === -1);
        }

        case 'modSeleccionEmpleado':{
            return state.map((item, i) => i === action.index 
                ? {...item, Codigo: {value: action.selectedOption.value, label: action.selectedOption.label}}
                : item
            )
        }

        case "modAccionTiempo": {
          return state.map((item, i) => i === action.index 
                ? {...item, AccionTiempo: action.AccionTiempo}
                : item
            )
        }

        case 'eraseIndex':{
            return state.filter(i => i.index !== action.index);
        }

        default: {
          return state;
        }
      }
    }
  );

  

  // useStates

    const [saOpsEmpleados, setasOpsEmpleados] = useState([])
  //functions
  function fetchAccionData() {
    axios
      .post(
        `http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas/DetallesTarea/Accion/Empleados`,
        { AccionID: AccionID }
      )
      .catch((e) => console.log(e))
      .then((response) => {
        dispatchReducerEmpleados({type: 'clearAll'})
        var _aEmpleados = [];
        var _OpsEmpleados = []
        _aEmpleados = response.data.Empleados;
        // Damos formato al tiempo recibido
        _aEmpleados.forEach((i) => {
          if (i.AccionTiempo !== null) {
            var [, tiempo] = i.AccionTiempo.split("T");
            var [horas, minutos] = tiempo.split(":");
            i.AccionTiempo = `${horas}:${minutos}`;
          } else {
            i.AccionTiempo = `No definido`;
          }
          dispatchReducerEmpleados({
            type: "initialize_empleados",
            payload: i,
          });
        });

        response.data.aTrabajadores.forEach(i => {
            _OpsEmpleados = [..._OpsEmpleados, {value: i.ID, label: `${i.Codigo} | ${i.Nombre} ${i.Apellidos}`}]
        })

        try {
            setasOpsEmpleados(_OpsEmpleados);
            
        } catch {
          alert("Error obteniendo datos de la accion");
        }
      });
  }

  //Functions
  function handleSubmit() {
    if(aReducerEmpleados.length === 0) {
      alert('La lista de empleados esta vacia, tienes que asignar al menos a una persona')
    }
    else if(aReducerEmpleados.length === 1 && aReducerEmpleados[0].Codigo === 'vacio'){
      alert('El empleado asignado esta vacio, selecciona uno de la lista')
    }
    else if(aReducerEmpleados.filter(i => i.Codigo === 'vacio') > 0){
      alert('Rellena todos los empleados correctamente, no dejes ninguno para seleccionar')
    }
    else{
      aReducerEmpleados.forEach(i => {
        
        axios.post(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/UpdateEmpleadoAccion`,
          {
            Empleado: {
              ID : i.Codigo.value,
              tiempo: i.AccionTiempo
            },
            AccionID: AccionID
          }
        )
        .catch(() => alert('Error al actualizar los empleados, comprueba el estado del servidor'))
        //.then(()=> alert('Empleados de la accion actualizados'))
      })
    }
  }

  useEffect(() => {
    fetchAccionData();
  }, []);
  /*
    function dispMaterialesAccion(){
        if(Materiales.length > 0){
            
            )
        }else{
            return(
                <div className='row d-flex'>
                    <p className='h5 mt-3 mb-2 mt-2 ms-3'> - No hay materiales implicados en la accion</p>
                </div>
            );
        }
        
    }
    */
  return (
    <Fragment>
      <div key={Math.random()} className='table table-responsive-sm'>
        <table>
          <thead>
            <tr>
                <th scope='col' className='text-center p-2'>
                  Empleado
                </th>
                <th scope='col' className='text-center p-2'>
                  Duracion
                </th>
            </tr>
          </thead>
          <tbody>
            {aReducerEmpleados &&
              aReducerEmpleados.map((i, n) => {
                return (
                <tr id={n++}>
                    <td key={Math.random()} className='p-2 border border-dark text-center'>
                      <Select
                        value={i.Codigo}
                        isSearchable={true}
                        options={saOpsEmpleados}
                        onChange={(e)=>{dispatchReducerEmpleados({type: 'modSeleccionEmpleado', selectedOption: e, index: i.index})}}
                      />
                    </td>
                    
                    <td key={Math.random()} className='p-2 border border-dark text-center'>
                        <input type='time' value={i.AccionTiempo} defaultValue='00:00'
                            onChange={(e)=> 
                                dispatchReducerEmpleados({type: 'modAccionTiempo', index: i.index, AccionTiempo: e.target.value})
                            } 
                        />
                    </td>
                    <td className='border border-dark text-center'>
                        <button className="btn btn-primary small" 
                        onClick={()=>{dispatchReducerEmpleados({type: 'eraseIndex', index: i.index})}}
                        >
                            Eliminar
                        </button>
                    </td>
                </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div key={Math.random()} className='row w-25'>
        <div className="col">
            <button
                className='btn btn-primary w-75 ms-2'
                onClick={() => {
                    dispatchReducerEmpleados({ type: "addEmpleado" });
                }}
            >
                Agregar Empleado
            </button>
        </div>
      </div>
      <div key={Math.random()} className='row mt-3'>
        <div className="col">
            <button
                className='btn btn-primary w-25 ms-2'
                onClick={() => {
                    handleSubmit();
                }}
            >
              Actualizar empleados
            </button>
        </div>
      </div>
      
      
    </Fragment>
  );
}
