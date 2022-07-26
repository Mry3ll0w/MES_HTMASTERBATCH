import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dateFormat from 'dateformat';
import { Button } from '@mui/material';
import { DataGrid, esES, GridToolbar} from '@mui/x-data-grid';
import { useState } from 'react';
import { styles } from '../Style/styles';
import { es } from 'date-fns/locale';
import { useEffect } from 'react';
import axios from 'axios';
import { addMinutes } from 'date-fns/esm';
import { useNavigate } from 'react-router-dom';
import { corrector_fecha } from './grafica_estadistico';
export default function GraficaEstadistico() {
  
  //redirect
  const navigate = useNavigate();
  const nav_login = () =>{
    navigate('/Login')
  }
 
  //alert(`Nombre : ${sessionStorage.getItem('logged')}`)
  if(sessionStorage.getItem('logged') === null){
    alert('Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario');
    nav_login();
  }

  //Para sumar y restar los minutos
  var addMin = require('date-fns/addMinutes');

  //UseStates para controlar 
  const [Fecha_Limite_Inferior, setInferior] = useState(new Date());
  const [Fecha_Limite_Superior, setSuperior] = useState(new Date());
  const [Tendencias, setTendencias] = useState([]);
  const [Productos,SetProductos]=useState([]);
  const [OFS,setOFs]=useState([]);
  const [Valores, setValores] = useState([])
  //Get selecciones realizadas
  const [Selected_Ten, setSelectedTen]=useState('#'); 
  const [Selected_OF,setSelectedOF]=useState('');

  const [Selector_f_rango,setRango] = useState(false);
  
  const [Media,SetMedia] = useState(0.00);
  const [Maximo,SetMaximo] = useState(0.00)
  const [Minimo, SetMinimo] = useState(0.00) 
  

  
  //Peticiones a REST API
  useEffect(()=>{
    axios.get('http://192.168.0.123:4001/dataEstadistico').then((response) => {
            setOFs(response.data.OFS)
            SetProductos(response.data.Productos);
            setTendencias(response.data.Tendencias);
            //console.log(response)
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
      Fecha_Inicio : corrector_fecha(i.Fecha_Inicio),
      Fecha_Fin : corrector_fecha(i.Fecha_Fin) 
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

  //Construccion de filas para mostrar el resultado del calculo
  const cols_res_c = [
    { field: "Valor", headerName: "Valor", width: "150" },
    { field: "FechaHora", headerName: "FechaHora", width: "450" }
  ];
  let rows_res_c=[];
  Valores.map((i,n) => {
    return (
      rows_res_c = [...rows_res_c, {
        id : n++,
        Valor : i.Valor,
        FechaHora : dateFormat(i.FechaHora,'yyyy-mm-dd hh:mm:ss')
      }]
    )
  })


  //Funcion para controlar que se ha seleccionado todo lo necesario para calcular la media
  function handleCalculation(){
      var ok = true;
      var err;
      //Comprobamos que se han seleccionado la tendencia
      if (Selected_Ten === '#'){ok = false; alert("Tienes que seleccionar una tendencia");} 
      
      if(ok){
        axios.post('http://192.168.0.123:4001/calcEstadistico',
          {
            Lim_Sup : Fecha_Limite_Superior,
            Lim_Inf : Fecha_Limite_Inferior,
            Tendencia : Selected_Ten
          }
        ).catch(e => err=e)
        .then( r => {
          console.log(r.data)
          setValores(r.data.Datos_Calculados)
          console.log(Valores)
          
          //console.log(r.Datos_Calculados.map(Object => {return [Object.key, Object.value]}))
          if (r.data.Resultado[0].media == null || r.data.Resultado[0].max == null || r.data.Resultado[0].min == null){
            SetMedia('No hay datos para realizar el calculo');
            SetMinimo('No hay datos para realizar el calculo');
            SetMaximo('No hay datos para realizar el calculo');
            alert("Calculo finalizado, pero no existen valores de esa tendencia")
          }
          else{
            SetMedia(r.data.Resultado[0].media.toFixed(3));
            SetMinimo(r.data.Resultado[0].min);
            SetMaximo(r.data.Resultado[0].max);
            alert("Calculo realizado")
          } 
          
          
        })//Guardamos la respuesta del post en los useStates
      }
      if(err){
        alert("Fallo en el calculo");
      }
      
      
  }

  //Visuals
  return (
    <Fragment>
    <div>
      <div style={styles.leftbox}>
        
      
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
        renderInput={(props) => <TextField sx={{p:'3px',m:'3px',width : '250px'}} {...props} />}
        label="Limite Superior"
        value={Fecha_Limite_Superior}
        onChange={(newValue) => {
          setSuperior(newValue);
        }}
        disabled={Selector_f_rango}
      />

      </LocalizationProvider>
      
      <br />
      <p>
        <Button
              sx={{ m: "10px", marginLeft : '33%'}}
              onClick={handleCalculation}
              variant="contained"
        >
          Calcula los datos
        </Button>
      </p>

        
      
      <TextField sx={{m : '2px'}} label="Media Aritmetica"value={Media} disabled/>
      <TextField sx={{m : '2px'}} label="Valor Maximo de los datos" value={Maximo} disabled/>
      <TextField sx={{m : '2px'}} label="Valor Minimo de los datos" value={Minimo} disabled/>

      <h2>Valores obtenidos </h2>
      <DataGrid 
          sx={{ height: 500, width: '93%'}}
          rows = {rows_res_c}
          columns = {cols_res_c}
          pageSize={100}
          rowsPerPageOptions={[100]}
          
          />
        
      </div> 


      <div style={styles.rightbox}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
          sx={{ height: 400, width: '100%' }}
          rows = {rows_OF}
          columns = {cols_of}
          pageSize={100}
          rowsPerPageOptions={[100]}
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
          //components={{ Toolbar: GridToolbar }}
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