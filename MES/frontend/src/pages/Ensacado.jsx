
//Visuals


import { DataGrid } from '@mui/x-data-grid';
import React, { Fragment } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function RegEnsacado() {
    
    const [Productos,SetProductos] = useState([]);
    const [Ensacados, SetEnsacados] = useState([]);
    const [Seleccion, Setselected] = useState([]);
    //Obtenemos el resultado del get
    useEffect(() => {
        axios.get('http://172.26.0.21:3001/RegEnsacado').then((response) => {
            SetProductos(response.data.Productos);
            SetEnsacados(response.data.Ensacados);
        }).catch( error => console.log(error));
    });

    //Columnas 
    const columns= [
        {field : 'Fecha', headerName: 'Fecha', width:'150'},
        {field : 'Turno', headerName: 'Turno', width: '90'},
        {field : 'Producto', headerName: 'Producto', width: '150'},
        {field : 'Palet', headerName:'Palet', width: '150'},
        {field : 'Cantidad', headerName: 'Cantidad(KG)', width : '70'},
        {field : 'Peso_Saco', headerName :'Peso Saco (KG)', width : '70'},
        {field : 'Ant', headerName : 'Anterior (KG)', width : '70'}

    ];

    //Construimos las filas
    let rows = [];
    
    Ensacados.map( (i, n) =>{
        rows = [...rows, {id: n++, Fecha : i.Fecha, Turno : i.Turno, Producto: i.Producto, 
            Palet: i.Palet, Cantidad : i.Cantidad, Peso_Saco : i.Peso_Saco, Ant : i.Ant}];
    });
    
    
  return (
    <Fragment>
        <div>Bienvenido al registro de ensacado</div>
        <p>A continuación mostramos los ultimos ensacados</p>
        <div style={{ height: 400, width: '100%' }}>
        
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(r)=>{
                
                const selectedIDs = new Set(r);
                const selectedRowData = rows.filter((row) =>
                    selectedIDs.has(row.id)
                );
                console.log(selectedRowData);
                Setselected(selectedRowData);
            }}
        />
        </div>
        <div>
        <p>Datos seleccionados : {Seleccion.map((i => {return i.Palet}))}</p>
        
        
        
        </div>
        
    </Fragment>
    );
}
