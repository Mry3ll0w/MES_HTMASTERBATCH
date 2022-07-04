
//Visuals
import { TextField,Button,Paper,Box, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { Fragment } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dateFormat, { masks } from "dateformat";

export default function RegEnsacado() {
    
    //Necesitamos UseState para tratar con los TextFields
    const [M_Fecha, mfecha] = useState('')
    const [M_Turno, mturno] = useState(['Mañana', 'Tarde', 'Noche']);
    const [M_Producto, mprod] = useState('')
    const [M_Palet, mpalet] = useState('')
    const [M_Peso_Saco, mpsaco] = useState('')
    const [M_Cantidad, mcant] = useState('')
    const [M_Resto, mresto] = useState('')
    const [M_Ant, mant] = useState('')

    //Constantes para trabajar con los datos 
    const [Productos,SetProductos] = useState([]);
    const [Ensacados, SetEnsacados] = useState([]);
    const [Seleccion, Setselected] = useState([]);
    
    

    //Obtenemos el resultado del get
    useEffect(() => {
        axios.get('http://192.168.0.123:4001/RegEnsacado').then((response) => {
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
        {field : 'Cantidad', headerName: 'Cantidad(KG)', width : '120'},
        {field: 'Resto', headerName: 'Resto (KG)', width : '110'},
        {field : 'Peso_Saco', headerName :'Peso Saco (KG)', width : '130'},
        {field : 'Ant', headerName : 'Anterior (KG)', width : '100'}

    ];

    //Construimos las filas
    let rows = [];
    
    Ensacados.map( (i, n) =>{
        rows = [...rows, {id: n++, Fecha : i.Fecha, Turno : i.Turno, Producto: i.Producto, 
            Palet: i.Palet, Cantidad : i.Cantidad,Resto: i.Resto, Peso_Saco : i.Peso_Saco, Ant : i.Ant}];
    });

    //Funcion para tratar los textFields
    const TextFieldHandler = (e, setter) =>{ 
        setter(e.target.value);
    };

    //Formato de fechas

    
  return (
    <Fragment>
        <div>Bienvenido al registro de ensacado</div>
        <p>A continuación mostramos los ultimos ensacados</p>
        <div style={{ height: 300, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
            rowsPerPageOptions={[5]}
            onSelectionModelChange={(r)=>{
                
                const selectedIDs = new Set(r);
                const selectedRowData = rows.filter((row) =>
                    selectedIDs.has(row.id)
                );
                console.log(selectedRowData);
                Setselected(selectedRowData);
                //Creacion Ensacado
                selectedRowData.map( (i) => {
                   const tDate = new Date(i.Fecha);
                   dateFormat(tDate, "yyyy-mm-dd");
                   console.log(i.Fecha);
                   mfecha(tDate);
                   
                   mpalet(i.Palet);
                   mpsaco(i.Peso_Saco);
                   mcant(i.Cantidad);
                   mresto(i.Resto);
                   mant(i.ant);
                   
                })
                
            }}
        />
        </div>
        <Box sx={{p:2, border:'1px dotted blue'}} >
            <Paper>
            <h2>Modifica el Ensacado</h2>
            
            <TextField value={M_Fecha} onChange={TextFieldHandler} label="Fecha" sx={{m : '3px', p:'3px'}}/>

            <Select sx={{width : '100',m : '3px', p:'3px'}} defaultValue='Mañana' label='Turno'>
                <MenuItem value ={'Mañana'} onClick={e => mturno('Mañana')}>Mañana</MenuItem>
                <MenuItem value ={'Tarde'} onClick={e => mturno('Tarde')} >Tarde</MenuItem>
                <MenuItem value ={'Noche'} onClick={e => mturno('Noche')} >Noche</MenuItem>
            </Select>
            
            <Select sx={{width : '100',m : '3px', p:'3px'}} defaultValue="" label='Productos'>
                {Productos.map((i) =>{return (<MenuItem key={i.Producto} value={i.Producto} >{i.Producto}</MenuItem>)})}
            </Select>
            
            <TextField value={M_Palet} onChange={TextFieldHandler} label="NºLote-NºPalet" sx={{m : '3px', p:'3px'}} />
            <TextField value={M_Peso_Saco} onChange={TextFieldHandler} label="Peso Saco(kg)" sx={{m : '3px', p:'3px'}}/>
            <p></p>
            <TextField value={M_Resto} onChange={TextFieldHandler} label="Resto (kg)" sx={{m : '3px', p:'3px'}} />
            <TextField value={M_Cantidad} onChange={TextFieldHandler} label="Cantidad (kg)" sx={{m : '3px', p:'3px'}}/>
            <TextField value={M_Ant} onChange={TextFieldHandler} label="Cantidad (kg)" sx={{m : '3px', p:'3px'}}/>
            
            </Paper>
        
        </Box>
        
           
    </Fragment>
    );
}
