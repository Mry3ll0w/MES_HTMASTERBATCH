import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dateFormat from 'dateformat';
import { Box } from '@mui/system';
import {Checkbox, FormControlLabel, Menu,MenuItem, Button, Autocomplete} from '@mui/material';
import { DataGrid, GridToolbar} from '@mui/x-data-grid';
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
  const [Tendencias, setTendencias] = useState([]);
  const [Productos,SetProductos]=useState([]);
  const [OFS,setOFs]=useState([]);
  
  //Get selecciones realizadas
  const [Selected_Prod,setSelectedProd]=useState('');
  const [Selected_Ten, setSelectedTen]=useState('#'); 
  const [Selected_OF,setSelectedOF]=useState('');

  const [Selector_f_rango,setRango] = useState(false);
  const [Selector_OF,setOF] = useState(false);
  const [Selector_Prod, setSelProd] = useState(false);

  const [Media,SetMedia] = useState(0.00);
  const [Maximo,SetMaximo] = useState(0.00)
  const [Minimo, SetMinimo] = useState(0.00) 
  

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
    { field: "ProductoID", headerName : 'Producto', width : "150"},
    { field: "Fecha_Inicio", headerName: "Fecha Inicio", width: "200" },
    { field: "Fecha_Fin", headerName: "Fecha Fin", width: "200" },
  ];

  //Construimos las filas de las OFS
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

  //Construimos las filas y columnas de las tendencias
  const cols_ten = [
    { field: "Tendencia", headerName: "Nº de Tendencia", width: "150" },
    { field: "Descripcion", headerName : 'Descripcion asociada', width : "760"}
    
  ];
  let rows_ten = [];
  Tendencias.map((i,n)=>{
    return (rows_ten = [...rows_ten,{
      id : n++,
      Tendencia : i.Tendencia,
      Descripcion : i.Descripcion
    }])
  });

  //Funcion para controlar que se ha seleccionado todo lo necesario para calcular la media
  function handleCalculation(){
      var ok = true;
      var err;
      //Comprobamos que se han seleccionado la tendencia
      if (Selected_Ten == '#'){ok = false; alert("Tienes que seleccionar una tendencia");} 
      
      if(ok){
        axios.post('http://192.168.0.123:4001/calcEstadistico',
          {
            Lim_Sup : Fecha_Limite_Superior,
            Lim_Inf : Fecha_Limite_Inferior,
            Tendencia : Selected_Ten
          }
        ).catch(e => err=e)
        .then( r => {
          if (r.data.Resultado[0].media == null || r.data.Resultado[0].max == null || r.data.Resultado[0].min == null){
            SetMedia('No hay datos para realizar el calculo');
            SetMinimo('No hay datos para realizar el calculo');
            SetMaximo('No hay datos para realizar el calculo');
          }
          else{
            SetMedia(r.data.Resultado[0].media);
            SetMinimo(r.data.Resultado[0].min);
            SetMaximo(r.data.Resultado[0].max);
          } 
          
          
        })//Guardamos la respuesta del post en los useStates
      }
      if(err){
        alert("Fallo en el calculo");
      }
      //else
        //alert("Calculo realizado correctamente")
      
      
  }

  //Filtros para aplicar en los dataGrid
  //DataGrid de OF
  

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
          //console.log(filtro_of)
        }}
        freeSolo
      />
      <p>
        <Button
              sx={{ m: "10px" }}
              onClick={handleCalculation}
              variant="contained"
        >
          Calcula los datos
        </Button>
      </p>
      <p>Media De Los Datos seleccionados: {Media} </p>
      <p>Maximo De Los Datos Seleccionados: {Maximo}</p>
      <p>Minimo De Los Datos Seleccionados: {Minimo}</p>
        
      </div> 

      <div style={styles.rightbox}>
        <DataGrid 
          sx={{ height: 400, width: '100%' }}
          rows = {rows_OF}
          columns = {cols_of}
          pageSize={10}
          rowsPerPageOptions={[5]}
          value ={Selected_OF}
          components={{ Toolbar: GridToolbar }}
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
            setSuperior(dateFormat(t,'yyyy-mm-dd hh:MM:ss'))
            var tm = new Date(i.Fecha_Inicio);
            tm = addMinutes(tm,+5)
            setInferior(dateFormat(tm,'yyyy-mm-dd hh:MM:ss'))
            
            })
          }}
          />
          <br />
          <h2>Selecciona a continuación una tendencia para realizar el calculo</h2>
          <DataGrid 
          sx={{ height: 400, width: '100%'}}
          rows = {rows_ten}
          columns = {cols_ten}
          pageSize={100}
          rowsPerPageOptions={[100]}
          value ={Selected_Ten}
          components={{ Toolbar: GridToolbar }}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = rows_ten.filter((row) =>
            selectedIDs.has(row.id)
            );
            
            selectedRowData.map(i => {
              setSelectedTen(i.Tendencia)
            })

          }}
          />
          <br /> <br /> <br /> <br />
        
      </div>
    </div>  
    </Fragment>
  );
}