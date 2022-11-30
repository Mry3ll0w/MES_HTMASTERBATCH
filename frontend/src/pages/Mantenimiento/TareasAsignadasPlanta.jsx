import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import {useReactToPrint} from 'react-to-print'

export default function TareasAsignadasEmpleados() {
    
    
    const [sSelectedEmpleado, setsSelectedEmpleado] = useState('')
    const [sCodigoEmpleadoSeleccionado, setsCodigoEmpleadoSeleccionado] = useState('');
    const [aOpsEmpleados, setaOpsEmpleados] = useState([])
    const [aTareas, setaTareas] = useState([])
    const toPrintRef = useRef();
    const handlePrint = useReactToPrint({content : () => toPrintRef.current,});
    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/TareasAsignadas`)
        .catch( e => console.log(e))
        .then( res => {
            var _aEmpleados = []
            res.data.Empleados.forEach(i => {
                
                _aEmpleados = [..._aEmpleados, 
                    {
                        value: i.Codigo,
                        label: `${i.Alias} | ${i.Nombre} | ${i.Apellidos}`,
                    },
                ]
            })
            setaOpsEmpleados(_aEmpleados)
            
        })
    });

    function dispEmpApoyo(sAlias){
      if(sAlias === null){
        return 'No se requieren empleados de apoyo'
      }
      else{
        var empleado = aOpsEmpleados.filter(i => i.label.includes(sAlias));
        return empleado[0].label
      }
    }

    function fetchTareasVinculadas(sCodigo, slabel){
      axios.post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas`, {
        Codigo: sCodigo,
      })
      .catch((e) => console.log(e))
      .then((response) => {
        //console.log(response.data.Tareas);
        setaTareas(response.data.Tareas);
      });
    }

    return (
        <div>
            <div className='container d-flex justify-content-center'>
                <div className='row d-flex ms-4'>
                    <p className='h3 justify-content-center'>
                        Selecciona el Empleado
                    </p>
                </div>
            </div>
            <div className='container d-flex justify-content-center'>
                <div className='row d-flex ms-4 w-25'>
                    <Select
                            className='basic-single'
                            options={aOpsEmpleados}
                            isSearchable={true}
                            onChange={(e) => {
                              setsCodigoEmpleadoSeleccionado(e.value)
                              setsSelectedEmpleado(e.label)
                              fetchTareasVinculadas(e.value);
                            }}
                    />
                    <button className='btn btn-primary mt-4' 
                        onClick={()=> {
                          handlePrint()
                        }}
                    > 
                      Imprimir Tabla de tareas
                    </button> 
                    
                </div>
            </div>
            <div ref={toPrintRef}>
              <div className='row d-flex justify-content-center mt-3'>
              <table className="table table-light w-50">
                <thead>
                  <tr>
                    <th scope='col' className='border border-dark text-center w-25'>Empleado asignado</th>
                    <th scope='col' className='border border-dark text-center w-50'>{sSelectedEmpleado}</th>
                  </tr>
                </thead>
              </table>
            </div>

            <div className='container d-flex justify-content-center mt-3'>
              <table className="table table-light">
                <thead>
                  <tr>
                    <th scope="col" className="border border-dark text-center">
                      #
                    </th>
                    <th scope="col" className="border border-dark text-center">
                      Codigo
                    </th>
                    <th scope="col" className="border border-dark text-center">
                      Criticidad
                    </th>
                    <th scope="col" className="border border-dark text-center">
                      Descripcion
                    </th>
                    <th scope="col" className="border border-dark text-center">
                      F.Programada
                    </th>
                    <th scope="col" className="border border-dark text-center">
                      T.Estimado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aTareas.map((i, n) => {
                    return (
                      <tr>
                        <td className="border-start border-end border-dark text-center">
                          {n + 1}
                        </td>
                        <td className="border-start border-end border-dark text-center">
                          {i.Codigo}
                        </td>
                        <td className="border-start border-end border-dark text-center">
                          {i.Criticidad}
                        </td>
                        <td className="border-start border-end border-dark">{i.Descripcion}</td>
                        <td className="border-start border-end border-dark text-center">
                          {i.FechaProgramada}
                        </td>
                        <td className="border-start border-end border-dark text-center">
                          {i.TiempoEstimado}
                        </td>
                        <td 
                          className="border-start border-end border-top border-dark text-center d-print-none"
                          onClick={()=>{
                            axios.post(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/TareasAsignadas`, {
                              iTareaID: i.ID,
                            }).catch(e => console.log(e))
                            .then(
                              window.location.reload(false)
                            )
                          }}
                        >
                          <button className='btn btn-primary p-3'>Desasignar Tarea</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className='container d-flex justify-content-center mt-3'>
              <p className='h3'>Empleados de Apoyo</p>
            </div>
            <div className='container d-flex justify-content-center mt-3'>
              <table className="table table-light">
                <thead>
                  <tr>
                    <th scope="col" className="border border-dark text-center">
                      N° tarea
                    </th>
                    <th scope="col" className="border border-dark text-center">
                      Nombre
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aTareas.map((i, n) => {
                    return (
                      <tr>
                        <td className="border-start border-end border-dark text-center">
                          {n + 1}
                        </td>
                        <td className='border-start border-end border-dark text-center'>
                          {dispEmpApoyo(i.EmpleadoSec)}
                        </td>                       
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
}
