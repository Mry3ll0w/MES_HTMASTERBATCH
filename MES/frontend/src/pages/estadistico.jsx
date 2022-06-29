
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
//Encargado de mostrar el estadistico de determinadas tendencias en una producción realizada en un tramo horario
export default function Estadistico() {
    let navigate = useNavigate();
  return (
    <Fragment>
        <div>Bienvenido Selecciona a donde quieres ir </div>
    <div>
        <button onClick={() =>{navigate('/')}}>Volver al menu de inicio</button>
    </div>
    </Fragment>
  )
}
