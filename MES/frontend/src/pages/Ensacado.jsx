
//Visuals
import { TextField,Button,Paper,Box, Select, MenuItem, FormControl, InputLabel, Input, makeStyles} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { Fragment } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import dateFormat from "dateformat";

export default function RegEnsacado() {
    
    //Necesitamos UseState para tratar con los TextFields
    const [M_Fecha, mfecha] = useState('')
    const [M_Turno, mturno] = useState('');
    const [M_Producto, mprod] = useState('')
    const [M_Palet, mpalet] = useState('')
    const [M_Peso_Saco, mpsaco] = useState('')
    const [M_Cantidad, mcant] = useState('')
    const [M_Resto, mresto] = useState('')
    const [M_Ant, mant] = useState('')

    //Constantes para trabajar con los datos 
    const [Productos,SetProductos] = useState([]);
    const [Ensacados, SetEnsacados] = useState([]);
    const [EnsMod, SetEnsMod] = useState([]);
    
    

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
        return rows = [...rows, {id: n++, Fecha : i.Fecha, Turno : i.Turno, Producto: i.Producto, 
            Palet: i.Palet, Cantidad : i.Cantidad,Resto: i.Resto, Peso_Saco : i.Peso_Saco, Ant : i.Ant}];
    });

    //Funciones para tratar los textFields




    function UpdateEnsacado(){
        
        axios.post('http://192.168.0.123:4001/UpdateEnsacado',
        {
            Fecha :M_Fecha, Turno : M_Turno, Producto : M_Producto, Palet : M_Palet, Peso_Saco : M_Peso_Saco,
            Cantidad : M_Cantidad, Resto : M_Resto, Ant : M_Ant 
        }
        ).then(() => {
            alert("Insercion realizada")
        }).catch( err => {console.log(err)})
        ;
    }
    
    
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
                //Creacion Ensacado
                selectedRowData.map( (i) => {
                   var tDate = new Date(i.Fecha);
                   tDate = dateFormat(tDate, "yyyy-mm-dd");
                   console.log(tDate);
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
        {<Box sx={{p:2,m:'3px', border:'1px dotted blue'}} >
            <Paper>
            <h2>Modifica el Ensacado</h2>
            
            
            <TextField id="mdate" value={M_Fecha} onChange={e => mfecha(e.target.value)} label="Fecha" sx={{m : '3px', p:'3px'}}/>
            
            <FormControl>{/* Para darle formato mas limpio a los Select*/}
                <InputLabel>Turnos</InputLabel>
                <Select 
                    sx={{width : '100',m : '3px', p:'3px', minWidth : 100}} 
                    defaultValue='' 
                    label='Turno'
                    onChange={e => mturno(e.target.value)}
                >
                    <MenuItem value ={'Mañana'} >Mañana</MenuItem>
                    <MenuItem value ={'Tarde'}  >Tarde</MenuItem>
                    <MenuItem value ={'Noche'} >Noche</MenuItem>
                </Select>
            </FormControl>
            
            <FormControl>
            <InputLabel>Productos</InputLabel>
                <Select 
                    sx={{width : '100',m : '3px', p:'3px', minWidth : '120px'}} 
                    defaultValue="" 
                    label='Productos'
                    onChange={e => mprod(e.target.value)}
                >
                    {Productos.map((i) =>{return (<MenuItem key ={i.Producto} value={i.Producto}>{i.Producto}</MenuItem>)})}
                </Select>
            
            </FormControl>
                
            
            
            <TextField value={M_Palet} onChange={e => mpalet(e.target.value)} label="NºLote-NºPalet" sx={{m : '3px', p:'3px'}} />
            <TextField value={M_Peso_Saco} onChange={e => mpsaco(e.target.value)} label="Peso Saco(kg)" sx={{m : '3px', p:'3px'}}/>
            <p></p>
            <TextField value={M_Resto} onChange={e => mresto(e.target.value)} label="Resto (kg)" sx={{m : '3px', p:'3px'}} />
            <TextField value={M_Cantidad} onChange={e => mcant(e.target.value)} label="Cantidad (kg)" sx={{m : '3px', p:'3px'}}/>
            <TextField value={M_Ant} onChange={e => mant(e.target.value)} label="Cantidad (kg)" sx={{m : '3px', p:'3px'}}/>
            
            
            </Paper>
            <Button sx={{m : '4px'}}
                onClick={UpdateEnsacado} 
                variant="contained"
            >
                Modifica el Ensacado
            </Button>
        </Box>}
        
           
    </Fragment>
    );
}
