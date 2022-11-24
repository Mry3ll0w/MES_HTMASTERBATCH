import React, { Fragment, useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'

export default function DetallesTareaAccion({AccionID}) {
    // useStates 
    const [Empleados, setEmpleados] = useState([]);
    const [Materiales, setMateriales] = useState([])

    useEffect(() => {
        axios.post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas/DetallesTarea/Accion`,
            {AccionID: AccionID}
        ).catch( e => console.log(e))
        .then(response => {
            
            var _aEmpleados = []
            _aEmpleados = response.data.Empleados;
            // Damos formato al tiempo recibido
            _aEmpleados.forEach(i => {
                if(i.AccionTiempo !== null){
                    var [, tiempo] = i.AccionTiempo.split('T');
                    var [horas, minutos] = tiempo.split(':')
                    i.AccionTiempo = `${horas}:${minutos}`
                }
                else{
                    i.AccionTiempo = `No definido`
                }
            })
            console.log(_aEmpleados)
            try{
                setEmpleados(_aEmpleados)
                setMateriales(response.data.Materiales)
            }
            catch{
                console.log('Error obteniendo datos de la accion')
            }
            
        })
    },[])
    
    return (
        <Fragment>
            <div className='table table-responsive-sm'>
                <table>
                    <thead>
                        <th scope='col' className='text-center p-2'>Codigo Empleado</th>
                        <th scope='col' className='text-center p-2' >Apellidos</th>
                        <th scope='col' className='text-center p-2' >Nombre</th>
                        <th scope='col' className='text-center p-2' >Duracion</th>
                    </thead>
                    <tbody>
                        {Empleados.map( (i, n) => {
                            return(
                                <tr id = {n++}>
                                    <td className='p-2 border border-dark text-center'>
                                        {i.Codigo}
                                    </td>
                                    <td className='p-2 border border-dark text-center'>
                                        {i.Apellidos}
                                    </td>
                                    <td className='p-2 border border-dark text-center'>
                                        {i.Nombre}
                                    </td>
                                    <td className='p-2 border border-dark text-center'>
                                        {i.AccionTiempo}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='row d-flex'>
                <p className='h3 mt-3 mb-3'>
                    Materiales usados en la accion
                </p>
            </div>
            <div className='row d-flex'>
                <div className='table table-responsive-sm'>
                <table>
                    <thead>
                        <th scope='col' className='text-center p-2'>Cantidad utilizada</th>
                        <th scope='col' className='text-center p-2' >Descripción</th>
                    </thead>
                    <tbody>
                        {Materiales.map( (i,n) => {
                            return(
                                <tr id={n++}>
                                    <td className='p-2 border border-dark text-center'>{i.CantidadMaterial}</td>
                                    <td className='p-2 border border-dark text-center'>{i.Descripcion}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            </div>
        </Fragment>
    )
}
