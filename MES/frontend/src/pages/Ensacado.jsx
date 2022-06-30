
//Visuals


import { DataGrid } from '@mui/x-data-grid';
import React, { Fragment } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
export default function RegEnsacado() {

    const [Productos,SetProductos] = useState([]);
    const [Ensacados, SetEnsacados] = useState([]);

    //Obtenemos el resultado del get
    useEffect(() => {
        axios.get('http://172.26.0.21:3001/RegEnsacado').then((response) => {
            SetProductos(response.data.Productos);
            SetEnsacados(response.data.Ensacados);
        }).catch( error => console.log(error));
    });

  return (
    <Fragment>
        <div>Bienvenido al registro de ensacado</div>
        <p>A continuación mostramos los ultimos ensacados</p>
        <div>

        {Productos.map((i) =>{
            return <h1>{i.Producto}</h1>
        })}
        </div>
           
        <footer> <button onClick={ event => window.location.href='/'}>Volver al menu inicial</button> </footer>
        
    </Fragment>
    );
}
