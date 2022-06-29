
import React from 'react'
import { Link } from 'react-router-dom'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
//Component encargado de mostrar un menu de selección (estadistico, ...)
export default function  Home() {
    let navigate = useNavigate();
    return (
    <Fragment>
        <div>Bienvenido Selecciona a donde quieres ir </div>
    <div>
        <nav>
            <Link to='/Estadistico'> Estadistico </Link>
        </nav>
    </div>
    <button onClick={() =>{navigate('/')}}>Volver al menu de inicio</button>
    </Fragment>
    
  );
}
