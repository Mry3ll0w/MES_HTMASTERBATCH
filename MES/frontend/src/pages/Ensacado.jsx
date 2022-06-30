import React, { Fragment } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
export default function RegEnsacado() {

    const [Productos,setProductos] = useState([]);
    const [ListEnsacados, SetEnsacados] = useState([]);

    //Obtenemos el resultado del get
    useEffect(() => {
        axios.get('http://172.26.0.21:3001/RegEnsacado').then((response) => {
            setProductos(response.data.Producto);
            SetEnsacados(response.data.ensacados);
        })
    });

  return (
    <Fragment>
        <div>Bienvenido al registro de ensacado</div>
        <p>A continuación mostramos los ultimos ensacados</p>
        <List>
        {ListEnsacados.map((i) => {
                return (
                <Fragment>
                    <h1>{i.Producto}</h1>
                </Fragment>
                )
           })}
        </List>
           
        <footer> <button onClick={ event => window.location.href='/'}>Volver al menu inicial</button> </footer>
    </Fragment>
    );
}
