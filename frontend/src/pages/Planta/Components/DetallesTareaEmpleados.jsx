import React, { Fragment, useEffect} from 'react'
import axios from 'axios'
import { useState,useRef,useReducer } from 'react'
import Select from 'react-select'

export default function DetallesTareaEmpleados({AccionID,}) {

    //Reducers
    const [aReducerEmpleados, dispatchReducerEmpleados] = useReducer((state = [], action) =>{
        
        switch(action.type){
            case 'initialize_empleados':{
                console.log(action.payload.Codigo)
                if(state.filter(i => i.Codigo === action.payload.Codigo) !== 0)
                    return [...state, {
                        Codigo : action.payload.Codigo,
                        Nombre: action.payload.Nombre,
                        Apellidos: action.payload.Apellidos,
                        AccionTiempo: action.payload.AccionTiempo
                    }]
                else{
                    return state;
                }
            }
            case 'add_empleado':{
                
                return state;
            }
            
            case 'mod_empleado_cantidad': {
                var _aReducerEmpleados = state;
                
                _aReducerEmpleados.forEach(i => {
                    if(i.Empleado.Codigo === action.payload.Codigo){
                        i.Empleado.AccionTiempo = action.payload.AccionTiempo
                    }
                })
                state = _aReducerEmpleados;
                return state;

            }
            
            default:{
                return state;
            }
        }
    })

    //Refs
    const formRef = useRef();

    // useStates 
    const [Empleados, setEmpleados] = useState([]);
    const [aEmpleados, setaEmpleados] = useState([])
    function fetchAccionData(){
        axios.post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas/DetallesTarea/Accion/Empleados`,
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
                
                dispatchReducerEmpleados({type: 'initialize_empleados', payload: i})
            })
            try{
                setEmpleados(_aEmpleados)
                setaEmpleados(response.data.aEmpleados)
            }
            catch{
                console.log('Error obteniendo datos de la accion')
            }
            
        })
    }

    //Functions
    function handleSubmit(){

    }

    useEffect(() => {
        fetchAccionData();
    },[])
    /*
    function dispMaterialesAccion(){
        if(Materiales.length > 0){
            return(
                <Fragment>
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
                                    <button 
                                        className='btn btn-primary' 
                                        onClick={()=>{dispatchReducerEmpleados({type: 'add_empleado',ID: 1 })}}
                                    >
                                            Add
                                    </button>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>
                
                {aReducerEmpleados && aReducerEmpleados.map(i => {
                    
                    return <h1> {i.Codigo} </h1>
                })}
            </div>
            
        </Fragment>
    )
}
