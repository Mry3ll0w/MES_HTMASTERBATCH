
//Visuals
import { TextField,Button,Paper,Box, Select, MenuItem, FormControl, InputLabel,Autocomplete} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { Fragment } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useEffect } from 'react';
import dateFormat from "dateformat";

export default function Mod_Ensacado() {
    
    //Necesitamos UseState para tratar con los TextFields
    const [M_Fecha, mfecha] = useState('')
    const [M_Turno, mturno] = useState('');
    const [M_Producto, mprod] = useState('')
    const [M_Palet, mpalet] = useState('')
    const [M_Peso_Saco, mpsaco] = useState('')
    const [M_Cantidad, mcant] = useState('')
    const [M_Resto, mresto] = useState('')
    const [M_Ant, mant] = useState('')

    //Manejadores de errores
    const [Err_palet, err_palet] = useState(false)
    const [F_error, ferr] = useState(false);
    const [T_error, terror] = useState(false);
    const [Prod_error, prerror] = useState(false);
    const [Saco_error,serror] = useState(false);
    const [Cant_Error, cerror] = useState(false);
    const [Resto_Error, rerror]= useState(false);
    const [Ant_Error, aerror] = useState(false);

    //Constantes para trabajar con los datos 
    const [Productos,SetProductos] = useState([]);
    const [Ensacados, SetEnsacados] = useState([]);
    
    
    

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
        {field : 'Palet', headerName:'NºLote-NºPalet', width: '150'},
        {field : 'Cantidad', headerName: 'Cantidad(KG)', width : '120'},
        {field: 'Resto', headerName: 'Resto (KG)', width : '110'},
        {field : 'Peso_Saco', headerName :'Peso Saco (KG)', width : '130'},
        {field : 'Ant', headerName : 'Anterior (KG)', width : '100'}

    ];

    //Construimos las filas
    let rows = [];
    
    Ensacados.map( (i, n) =>{
        return rows = [...rows, {id: n++, Fecha : dateFormat(i.Fecha, "yyyy-mm-dd"), Turno : i.Turno, Producto: i.Producto, 
            Palet: i.Palet, Cantidad : i.Cantidad,Resto: i.Resto, Peso_Saco : i.Peso_Saco, Ant : i.Ant}];
    });

    //Funciones para tratar los textFields



    //Comprueba los erorres de la posible modificacion y modifica el Ensacado seleccionado
    function UpdateEnsacado(){
        var ok = true;
        //Comprobamos que se cumplan los elementos dados
        if (M_Fecha === '' || M_Fecha.length !== 10){
            ok = false;
            ferr(true);
            alert("La Fecha no puede estar en blanco, o el formato de la fecha no es el correcto")
        }
        else ferr(false);

        if(M_Turno === ''){
            ok = false;
            terror(true);
            alert("Selecciona un Turno de la lista inferior")
        }
        else terror(false);

        if(M_Producto === ''){
            ok = false;
            prerror(true);
            alert("Tras la seleccion/escritura del producto debes presionar intro para que se envie correctamente.");
        }else prerror(false);

        if(M_Palet === '' || M_Palet.length !== 14) {
            ok = false;
            err_palet(true);
            alert("No dejes el palet en blanco o revisa el formato del mismo (xxxxxxxxxxx-xxxx) ")
        }else err_palet(false);

        if(isNaN(M_Peso_Saco) === true){
            ok = false;
            serror(true);
            alert("El saco debe ser un valor numerico")
        }else serror(false);

        if(isNaN(M_Cantidad) === true){
            ok = false;
            cerror(true);
            alert("La Cantidad no puede ser un valor no numerico");
        }else cerror(false);

        if(isNaN(M_Resto) === true){
            ok = false;
            rerror(true);
            alert("El Resto no puede ser no numerico");
        }else rerror(false);

        if(isNaN(M_Ant) === true){
            ok = false;
            aerror(true);
            alert("Anterior debe tener un valor numerico")
        }else aerror(false)
        
        //Si todo esta correcto enviamos el post para que el backend trate la query
        if(ok){
            axios.post('http://192.168.0.123:4001/UpdateEnsacado',
            {
                Fecha :M_Fecha, Turno : M_Turno, Producto : M_Producto, Palet : M_Palet, Peso_Saco : M_Peso_Saco,
                Cantidad : M_Cantidad, Resto : M_Resto, Ant : M_Ant 
            }
            ).then(() => {
                alert("Insercion realizada")
            }).catch( err => {console.log(err)})
            ;
            window.location.reload(false);
        }
            
    }
    
    
  return (
    <Fragment>
        <h1>
            Bienvenido al panel de modificacion de los ensacados
        </h1>
        <p>Se muestran los ultimos ensacados, ordenados por fecha, seleccione UN ÚNICO ensacado y podrá modificarlo.</p>
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
                   return 0;
                })
                
            }}
        />
        </div>
        {<Box sx={{p:2,m:'3px', border:'1px dotted blue'}} >
            <Paper>
            <h2>Modifica el Ensacado</h2>
            
            
            <TextField 
                id="mdate" value={M_Fecha} onChange={e => mfecha(e.target.value)} label="Fecha" sx={{m : '3px', p:'3px'}}
                error = {F_error}
            />
            
            <FormControl>{/* Para darle formato mas limpio a los Select*/}
                <InputLabel>Turnos</InputLabel>
                <Select 
                    sx={{width : '100',m : '3px', p:'3px', minWidth : 100}} 
                    defaultValue='' 
                    label='Turno'
                    onChange={e => mturno(e.target.value)}
                    required
                    error = {T_error}
                >
                    <MenuItem value ={'Mañana'} >Mañana</MenuItem>
                    <MenuItem value ={'Tarde'}  >Tarde</MenuItem>
                    <MenuItem value ={'Noche'} >Noche</MenuItem>
                </Select>
            </FormControl>
            
            <FormControl>
            <Autocomplete 
                options={Productos} 
                getOptionLabel={(o)=> o.ProductoID}
                renderInput ={ (e) => <TextField {...e} value={M_Producto} onChange={e => mprod(e.target.value)} sx={{p : '3px', m : '3px', width : '250px'}}></TextField>}
                onChange = {(e, v) => mprod(v.ProductoID)} 
                freeSolo
            />
            </FormControl>
                
            <h1>{M_Producto}</h1>
            
            <TextField 
                value={M_Palet} onChange={e => mpalet(e.target.value)} label="NºLote-NºPalet" sx={{m : '3px', p:'3px'}}
                error={Err_palet}
            />
            <TextField 
                value={M_Peso_Saco} onChange={e => mpsaco(e.target.value)} label="Peso Saco(kg)" sx={{m : '3px', p:'3px'}}
                error={Saco_error}
            />
            <p></p>
            <TextField 
                value={M_Resto} onChange={e => mresto(e.target.value)} label="Resto (kg)" sx={{m : '3px', p:'3px'}} 
                error= {Resto_Error}
            />

            <TextField 
                value={M_Cantidad} onChange={e => mcant(e.target.value)} label="Cantidad (kg)" sx={{m : '3px', p:'3px'}}
                error= {Cant_Error}
            />

            <TextField 
                value={M_Ant} onChange={e => mant(e.target.value)} label="Anterior (kg)" sx={{m : '3px', p:'3px'}}
                error={Ant_Error}
            />
            
            
            </Paper>
            <Button sx={{m : '10px'}}
                onClick={UpdateEnsacado} 
                variant="contained"
            >
                Modifica el Ensacado
            </Button>
        </Box>}
        
           
    </Fragment>
    );
}
