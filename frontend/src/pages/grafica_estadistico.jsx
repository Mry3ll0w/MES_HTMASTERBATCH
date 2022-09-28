import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dateFormat from 'dateformat';
import {Button} from '@mui/material';
import { DataGrid, esES, GridToolbar} from '@mui/x-data-grid';
import { useState } from 'react';
import { styles } from '../Style/styles';
import { es } from 'date-fns/locale';
import { useEffect } from 'react';
import axios from 'axios';
import { addMinutes } from 'date-fns/esm';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {DateTime} from 'luxon'


//Grafica 
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

/**
 * Prepara una fecha con formato de SQL a js para enviarlo 
 * @param String: d
 * @return y : 0, mm : 0, dd: 0, time: '00:00'
 */
export function format_date_guion(d){

  var r = {y : 0, mm : 0, dd: 0, hours : '00', minutes : '00', seconds: '00' , luxon : ''}
  if(d !== null){

    var [fecha, hora] = d.split(' ')
    var [y, m, d] = fecha.split('-')
    var [horas, minutos, segundos] = hora.split(':')

    r.y = y;
    r.mm = m;
    r.dd = d;
    r.hours = horas;
    r.minutes = minutos;
    r.seconds = segundos;
    r.luxon = `${fecha}T${hora}`
  }

  return r;
}


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * @brief Funcion encargada de dar formato a la fecha entrante, para ponerla en formato esES
 * @param {Date object or string} f 
 * @returns string
 */
export function corrector_fecha(f){
    //console.log(f);
    
    if(typeof(f) == "string"){
      var [tFecha, tHora] = f.split("T");
      //console.log(tHora)
      var [horas, minutos, segundos] = tHora.split(":");
      var [f_sec, resto] = segundos.split(".");
      return `${tFecha} ${horas}:${minutos}:${f_sec}`;
    }
    else{
      var date = Date(f);
      var date_string = date.toString();

      var [tFecha, tHora] = date_string.split("T");
      var [horas, minutos, segundos] = tHora.split(":");
    
      return `${tFecha} ${horas}:${minutos}`;
    }
    
}


export default function GraficaEstadistico() {

    const navigate = useNavigate();
    
    const nav_login = () =>{
      navigate('/Login')
    }
   
    
    if(sessionStorage.getItem('logged') === null){
      
      nav_login();
      alert('Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario');
      
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

    //Opciones y Datos para la grafica seleccionada
    const options = {
        responsive: true,
        maintainAspectRatio : false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Valores obtenidos',
            },
            label :{
                display : false
            },
        },
    };
    
    const labels = Valores.map(i => {return i.FechaHora});//Los labels seran las fechas de los valores
    const scores = Valores.map(i => {return i.Valor})
    const gr_data = {
        labels,
        datasets:
        [
            {
                label : `Valores Tendencia ${Selected_Ten}`,
                data : scores,
                borderColor:'rgb(75,192,192)'
            }
        ]
    }

  
  //Peticiones a REST API
  useEffect(()=>{
    axios.get(`http://${process.env.REACT_APP_SERVER}/dataEstadistico`).then((response) => {
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
    { field: "Fecha_Inicio", headerName: "Fecha Inicio", width: "160" },
    { field: "Fecha_Fin", headerName: "Fecha Fin", width: "160" },
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
        FechaHora : dateFormat(i.FechaHora,'yyyy-mm-dd HH:MM:ss')
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
        axios.post(`http://${process.env.REACT_APP_SERVER}/calcEstadistico`,
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
      <div>
        
      
      <br /> <br />
      <LocalizationProvider  dateAdapter={AdapterDateFns} locale={es}>
          <DateTimePicker
            style={styles.timepickers}
            renderInput={(props) => <TextField sx={{p:'3px',m:'3px',width:'250px',marginLeft:'3%'}} {...props} />}
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
        renderInput={(props) => <TextField sx={{p:'3px',m:'3px',width : '250px',marginLeft : '3%'}} {...props} />}
        label="Limite Superior"
        value={Fecha_Limite_Superior}
        components={{}}
        onChange={(newValue) => {
        setSuperior(newValue);
        }}
        disabled={Selector_f_rango}
      />

      </LocalizationProvider>
      
      
      <p>
        <Button
              sx={{ m: "10px", marginLeft : '3%'}}
              onClick={handleCalculation}
              variant="contained"
        >
          Genera la Grafica 
        </Button>
      </p>

        
      
        <TextField sx={{m : '2px',marginLeft:'3%'}} label="Media Aritmetica"value={Media} disabled/>
        <TextField sx={{m : '2px',marginLeft:'3%'}} label="Valor Maximo de los datos" value={Maximo} disabled/>
        <TextField sx={{m : '2px',marginLeft:'3%'}} label="Valor Minimo de los datos" value={Minimo} disabled/>
        
        <br />
        <br /> 
        <div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Selecciona la OF/Producto</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <DataGrid
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
                  sx={{ height: 500, width: '100%' }}
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
                      var t_date= format_date_guion(i.Fecha_Inicio)
                      var t = DateTime.fromISO(t_date.luxon)
    
                      setInferior(t.plus({minutes : 5}).toString())
                      t = DateTime.fromISO(format_date_guion(i.Fecha_Fin).luxon)
                      
                      setSuperior(t.plus({minutes : -5}).toString())

                  })
                }}
              />
          
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Selecciona la Tendencia</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>
      <br />
    </div>
 
          
 
        
        
        
      </div> 


        <div style={styles.center_box_gr}>
            <Line options={options} data={gr_data} style={{width:'100%',height:'90%',marginRight:10}}/>      
        </div>
    </div>  
    </Fragment>
  );
}