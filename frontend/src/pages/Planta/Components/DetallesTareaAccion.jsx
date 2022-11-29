import React, { Fragment, useEffect} from 'react'
import axios from 'axios'
import { useState } from 'react'
import Select from 'react-select'

export default function DetallesTareaAccion({AccionID,}) {
    // useStates 
    const [Empleados, setEmpleados] = useState([]);
    const [Materiales, setMateriales] = useState([])
    const [aMateriales, setaMateriales] = useState([])
    const [aEmpleados, setaEmpleados] = useState([])
    function fetchAccionData(){
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
            try{
                setEmpleados(_aEmpleados)
                setMateriales(response.data.Materiales)
                setaEmpleados(response.data.aEmpleados)
                setaMateriales(response.data.aMateriales);
            }
            catch{
                console.log('Error obteniendo datos de la accion')
            }
            
        })
    }

    

    useEffect(() => {
        fetchAccionData();
    },[])
    
    function dispMaterialesAccion(){
        if(Materiales.length > 0){
            return(
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
            )
        }else{
            return(
                <div className='row d-flex'>
                    <p className='h5 mt-3 mb-2 mt-2 ms-3'> - No hay materiales implicados en la accion</p>
                </div>
            );
        }
        
    }

    return (
        <Fragment >
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
                        <tr>
                            <td className='p-2 border border-dark text-center'>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='row d-flex'>
                <p className='h3 mt-3 mb-3'>
                    Materiales usados en la accion
                </p>
            </div>
            {dispMaterialesAccion()}
           
        </Fragment>
    )
}
