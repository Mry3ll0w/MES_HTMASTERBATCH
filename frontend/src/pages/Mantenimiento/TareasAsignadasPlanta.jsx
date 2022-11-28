import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import {useReactToPrint} from 'react-to-print'

export default function TareasAsignadasEmpleados() {
    const [bNotSelected, setbNotSelected] = useState(true);
    const [aEmpleados, setaEmpleados] = useState([])
    const [sSelectedEmpleado, setsSelectedEmpleado] = useState('')
    const [aOpsEmpleados, setaOpsEmpleados] = useState([])
    const [aTareas, setaTareas] = useState([])
    const refTaskTable = useRef();
    const handlePrint = useReactToPrint({content : () => refTaskTable.current,});
    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/TareasAsignadas`)
        .catch( e => console.log(e))
        .then( res => {
            var _aEmpleados = []
            res.data.Empleados.forEach(i => {
                
                _aEmpleados = [..._aEmpleados, 
                    {
                        value: i.Codigo,
                        label: `${i.Codigo} | ${i.Nombre} | ${i.Apellidos}`,
                    },
                ]
            })
            setaOpsEmpleados(_aEmpleados)
            setaEmpleados(res.data.Empleados)
        })
    });

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
                              axios.post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas`, {
                                  Codigo: e.value,
                                })
                                .catch((e) => console.log(e))
                                .then((response) => {
                                  setaTareas(response.data.Tareas);
                                  setsSelectedEmpleado(e.label)
                                });
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
            
            <div ref={refTaskTable} className='container d-flex justify-content-center mt-3'>
            <table className="table table-light">
                <thead>
                  <tr>
                    <th scope='col' className='border border-dark text-center'>Empleado asignado</th>
                    <th scope='col' className='border border-dark text-center'>{sSelectedEmpleado}</th>
                  </tr>
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
                        <td className="border-start border-end border-dark    text-center">
                          {i.TiempoEstimado}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
            </div>
        </div>
    );
}
