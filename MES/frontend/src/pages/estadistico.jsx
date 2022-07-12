import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dateFormat from 'dateformat';
import { Box } from '@mui/system';
import {Checkbox, FormControlLabel, Menu,MenuItem, Button, Autocomplete} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { styles } from '../Style/styles';
import { es } from 'date-fns/locale';
import { useEffect } from 'react';
import axios from 'axios';
import { addMinutes } from 'date-fns/esm';

export default function BasicDateTimePicker() {
  
  //Para sumar y restar los minutos
  var addMin = require('date-fns/addMinutes');

  //UseStates para controlar 
  const [Fecha_Limite_Inferior, setInferior] = useState(new Date());
  const [Fecha_Limite_Superior, setSuperior] = useState(new Date());
  const [Tendencias, setTendencias] = useState('');
  const [Productos,SetProductos]=useState([]);
  const [OFS,setOFs]=useState([]);
  
  //Get selecciones realizadas
  const [Selected_Prod,setSelectedProd]=useState('');
  const [Selected_Ten, setSelectedTen]=useState(''); 
  const [Selected_OF,setSelectedOF]=useState('');

  const [Selector_f_rango,setRango] = useState(false);
  const [Selector_OF,setOF] = useState(false);
  const [Selector_Prod, setSelProd] = useState(false);

  const [Lim_Sup, setLimSup]= useState('');
  const [Lim_Inf,setLimINF] =useState('');

  //Visuales para menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  //Peticiones a REST API
  useEffect(()=>{
    axios.get('http://192.168.0.123:4001/dataEstadistico').then((response) => {
            setOFs(response.data.OFS)
            SetProductos(response.data.Productos);
            setTendencias(response.data.Tendencias);
        }).catch( error => console.log(error));
  },[]);

  //Preparación DataGrid para OFS
  const cols_of = [
    { field: "OrdenFabricacionID", headerName: "OF", width: "150" },
    {field: "ProductoID", headerName : 'Producto', width : "150"},
    { field: "Fecha_Inicio", headerName: "Fecha Inicio", width: "200" },
    { field: "Fecha_Fin", headerName: "Fecha Fin", width: "200" },
  ];

  //Construimos las filas
  let rows_OF = [];
  
  OFS.map( (i, n) => {
    return (rows_OF=[...rows_OF,{
      id : n++,
      OrdenFabricacionID: i.OrdenFabricacionID,
      ProductoID : i.ProductoID,
      Fecha_Inicio : dateFormat(i.Fecha_Inicio,'yyyy-mm-dd hh:mm:ss'),
      Fecha_Fin : dateFormat(i.Fecha_Fin,'yyyy-mm-dd hh:mm:ss') 
    }])
  })


  //Visuals
  return (
    <Fragment>
    <div>
      <div style={styles.leftbox}>
        <h2>Izquierda:</h2>
        {/*Drop filtro */}
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
        
      >
        Filtrar
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() =>{
          setAnchorEl(null);
          setRango(false);
          setOF(true);
          setSelProd(true);
        }}>
          Filtrar por Fecha
        </MenuItem>
        <MenuItem onClick={() =>{
          setAnchorEl(null);
          setRango(true);
          setOF(false);
          setSelProd(true);
          
        }}>Filtrar por OF </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          setRango(true);
          setOF(true);
          setSelProd(false);
        }}>Filtar por Producto</MenuItem>
      </Menu>
      <br /> <br />
      <LocalizationProvider  dateAdapter={AdapterDateFns} locale={es}>
          <DateTimePicker
            style={styles.timepickers}
            renderInput={(props) => <TextField sx={{p:'3px',m:'3px',width:'250px'}} {...props} />}
            label="Limite Inferior"
            value={Fecha_Limite_Inferior}
            onChange={(e) => {
              setInferior(e);
            }}
            disabled={Selector_f_rango}
          />
      </LocalizationProvider>
      
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
      
      <DateTimePicker
        renderInput={(props) => <TextField sx={{p:'3px',m:'3px'}} {...props} />}
        label="Limite Superior"
        value={Fecha_Limite_Superior}
        onChange={(newValue) => {
          setSuperior(newValue);
        }}
        disabled={Selector_f_rango}
      />

      </LocalizationProvider>
      
      <br />
      <Autocomplete
        options={Productos}
        getOptionLabel={(o) => o.ProductoID}
        renderInput={(e) => (
          <TextField
            {...e}
            value={Selected_Prod}
            onChange={(e) => setSelectedProd(e.target.value)}
            sx={{ p: "3px", m: "3px", width: "250px" }}
            label="Filtrar Por Productos"
            
          ></TextField>
        )}
        onChange={(e, v) => {
          setSelectedProd(v.ProductoID)
          //filtramos la lista inferior
          console.log(v.ProductoID)
          var filtro_of=[]
          OFS.map( i=> {
            if (i.ProductoID ===v.ProductoID) filtro_of = [...filtro_of,i]
          })
          console.log(filtro_of)
        }}
        freeSolo
      />

                
      </div> 
      <div style={styles.rightbox}>
        <DataGrid 
          sx={{ height: 400, width: '100%' }}
          rows = {rows_OF}
          columns = {cols_of}
          pageSize={10}
          rowsPerPageOptions={[5]}
          value ={Selected_OF}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = rows_OF.filter((row) =>
            selectedIDs.has(row.id)
            );
            selectedRowData.map( i=> {
            var t = new Date(i.Fecha_Fin);
            //Limite inferior
            t = dateFormat(addMinutes(t,-5))
            //console.log(dateFormat(t,'yyyy-mm-dd hh:MM:ss'))
            setLimSup(dateFormat(t,'yyyy-mm-dd hh:MM:ss'))
            var tm = new Date(i.Fecha_Inicio);
            tm = addMinutes(tm,+5)
            setLimINF(dateFormat(tm,'yyyy-mm-dd hh:MM:ss'))
            })
          }}
          />
      </div>
    </div>  
    </Fragment>
  );
}