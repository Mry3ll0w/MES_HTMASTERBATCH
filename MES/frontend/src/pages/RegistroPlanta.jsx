import React,{useState,useEffect, Fragment} from 'react'
import axios from 'axios'
import { TextField,Button, Autocomplete } from '@mui/material'
import { styles } from '../Style/styles';
import { DataGrid, esES} from '@mui/x-data-grid';
import clsx from 'clsx';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import {Resizable} from 're-resizable';
import { DesktopDatePicker,LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from "date-fns/locale";

export default function RegistroPlanta() {

    //UseStates para controlar los datos del formulario
    const [TipoOf,setTOf]= useState('');
    const [HoraInicio,SetHoraInicio] = useState('')
    const [HoraFin,SetHoraFin]= useState('');
    const [D1,setD1]= useState('');
    const [D2,setD2]= useState('');
    const [D3,setD3]= useState('');
    const [D4,setD4]= useState('');
    const [D5,setD5]= useState('');
    const [D6,setD6]= useState('');
    const [EstadoEnsacado,setEstadoEnsacado]= useState('');
    const [ProcesoEstado, setProcesoEstado] = useState('');
    const [Permiso,setPermiso]= useState('');
    const [FechaFin,setFechaFin]= useState('');
    const [FechaInicio,setFechaInicio] = useState('');
    const [TurnoFin,setTurnoFin]= useState('');

    const [RState, setRState] = useState({ width: '80%', height: '630px' });
    //Variables para guardar los datos
    const [DatosPlanta,setDatosPlanta] = useState([]);
    const [PLC, setDatosPLC] = useState([]);
    const [SelLista, setSelLista] = useState([]);
    console.log({plc : PLC, Seleccionado : SelLista})
    //Funcion encargada de actualizar los datos existentes, tras la respuesta del POST
    const actualiza_Estado_Datos = () =>{
        SetHoraFin(PLC.HoraFin);
        SetHoraInicio(PLC.HoraInicio);
        setD1(PLC.D1);

    }
    //Para obtener los valores de los campos para el registro de la planta
    useEffect(()=>{
        axios.get('http://localhost:4001/RegPlanta')
        .catch(error=>console.log(error))
        .then(response=>{
            setDatosPlanta(response.data.Datos)
        })
    },[])
    //console.log(DatosPlanta)
    const columns = [
        {field : 'Estado' ,renderCell : (rowData) => {
          //console.log(rowData.row)
          if(rowData.row.EnsacadoEstadoID === 1){
            return <DoneOutlineIcon />
          }
          else{
            return <CancelIcon />
          }
        },
        width : '65'
      },
        { field: "OF", headerName: "OF", width: "60" },
        { field: "ProductoID", headerName: "Producto", width: "150" },
        { field: "of_fecha_alta", headerName: "Fecha de Alta", width: "125" },
        { field: "FechaInicio", headerName: "Fecha Inicio", width: "150" },
        { field: "FechaFin", headerName: "Fecha Fin", width: "85" },
        ,
    ];

    //Recibe una cadena
    function format_date(d){
      if(d !== null){
        var date = new Date(d);
        return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
      }
      else
        return d;
    }

    function format_hour(d){
      if (d !== null){
        var date = new Date(d);
        var ds = date.toTimeString();
        var [hours,minute] = ds.split(':')
        return `${hours}:${minute}`;
      }
      else
        return d;
    }

    
    DatosPlanta.map((i,n)=>{
            i.id = n++;
            i.FechaHoraRegInicio = format_date(i.FechaHoraRegInicio);
            i.FechaFin = format_date(i.FechaFin);
            i.FechaInicio = format_date(i.FechaInicio);
            
        }
    );
    //console.log(PLC)
    
  return (
    <Fragment>
      <div style={styles.AdjustableLeftBox}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={DatosPlanta}
          columns={columns}
          pageSize={100}
          //checkboxSelection
          rowsPerPageOptions={[10]}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = DatosPlanta.filter((row) =>
              selectedIDs.has(row.id)
            );
            console.log(selectedRowData);
            //Guardar datos del seleccionado en la lista
            setSelLista(
              DatosPlanta.filter((i) => {
                return i.OF === selectedRowData[0].OF;
              })
            );
            //Seleccion del ensacado, filtramos por OF y TurnoID (1,2,5)
            axios
              .post("http://localhost:4001/RegPlanta", {
                OF: selectedRowData[0].OF,
              })
              .catch((error) => console.log(error))
              .then((r) => {
                //Correcion formato de Hora recibida
                r.data.Datos[0].HoraFin = format_hour(r.data.Datos[0].HoraFin);
                r.data.Datos[0].HoraInicio = format_hour(
                  r.data.Datos[0].HoraInicio
                );
                setDatosPLC(r.data.Datos[0]);
                actualiza_Estado_Datos();
              });
          }}
        />
      </div>

      <Resizable
        style={styles.AdjustableRightBox}
        size={{ width: RState.width, height: RState.height }}
        onResizeStop={(e, direction, ref, d) => {
          setRState({
            width: RState.width + d.width,
            height: RState.height + d.height,
          });
        }}
      >
        <div style={styles.centered_div}>
          <TextField
            sx={{ margin: 2, width: "400px" }}
            value={PLC.OrdenFabricacionID || ""}
            disabled={true}
            label="Orden de Fabricación"
            inputProps={{ style: { textAlign: "center" } }}
          />
        </div>
        <div>
          <table>
            <td>
              <TextField
                sx={{ marginLeft: 2, width: "150px" }}
                label="H.Inicio"
                value={HoraInicio}
                onChange={(e) => SetHoraInicio(e.target.value)}
              />
            </td>

            <td>
              <Autocomplete
                options={["Normal", "Prueba"]}
                //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                renderInput={(e) => (
                  <TextField
                    {...e}
                    value={TipoOf}
                    onChange={(e) => setTOf(e.target.value)}
                    sx={{ width: "150px" }}
                    label="Tipo de OF"
                  ></TextField>
                )}
                onChange={(e, v) => setTOf(v.Codigo)}
                freeSolo
                sx={{ marginLeft: 2 }}
              />
            </td>

            <td>
              <TextField
                sx={{ marginLeft: 2, width: "150px" }}
                label="H.Fin"
                value={HoraFin}
                onChange={(e) => SetHoraFin(e.target.value)}
              />
            </td>

            <td>
              <TextField
                sx={{ marginLeft: 2, width: "85px" }}
                label="D1"
                value={D1}
              />
            </td>

            <td>
              <TextField
                sx={{ marginLeft: 2, width: "85px" }}
                label="D4"
                value={D4}
              />
            </td>

            {/**Fin de la primera linea  */}

            <tr>
              <td>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <DesktopDatePicker
                    label="F Inicio"
                    value={FechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </td>

              <td>
                <Autocomplete
                  options={[
                    "Finalizado | Ensacado Terminado",
                    "Pendiente | Ensacado pendiente de terminar ",
                  ]}
                  //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                  renderInput={(e) => (
                    <TextField
                      {...e}
                      value={EstadoEnsacado}
                      onChange={(e) => {
                        //Necesitamos introducir 1 2 o 3 no la cadena de texto
                        var str = String(e.target.value);
                        if (str.includes("Finalizado")) {
                          setEstadoEnsacado(1);
                        } else {
                          //Caso Pendiente
                          setEstadoEnsacado(2);
                        }
                      }}
                      sx={{ width: "150px" }}
                      label="Ensacado"
                    ></TextField>
                  )}
                  onChange={(e, v) => setTOf(v.Codigo)}
                  sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                />
              </td>

              <td>
                <Autocomplete
                  options={["Mañana", "Tarde", "Noche"]}
                  //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                  renderInput={(e) => (
                    <TextField
                      {...e}
                      value={TurnoFin}
                      onChange={(e) => {
                        var str = String(e.target.value);
                        if (str.includes("M")) {
                          setTurnoFin(1);
                        } else if (str.includes("T")) {
                          setTurnoFin(2);
                        } else {
                          setTurnoFin(3);
                        }
                      }}
                      sx={{ width: "150px" }}
                      label="Turno Fin"
                    ></TextField>
                  )}
                  onChange={(e, v) => setTOf(v.Codigo)}
                  sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                />
              </td>

              <td>
                <TextField
                  value={D2}
                  label="D2"
                  sx={{ marginLeft: 2, marginTop: 2, width: "85px" }}
                ></TextField>
              </td>

              <td>
                <TextField
                  value={D5}
                  label="D5"
                  sx={{ marginLeft: 2, marginTop: 2, width: "85px" }}
                ></TextField>
              </td>
            </tr>

            <tr>
              <td></td>
              <td>
                <Autocomplete
                  options={[
                    "Planta | Registro agreado en Planta",
                    "Aprobado | Registro aprobado por Dpto.",
                    "Bloqueado | Registro Desechado",
                  ]}
                  //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                  renderInput={(e) => (
                    <TextField
                      {...e}
                      value={TurnoFin}
                      onChange={(e) => {
                        var str = String(e.target.value);
                        if (str.includes("M")) {
                          setTurnoFin(1);
                        } else if (str.includes("T")) {
                          setTurnoFin(2);
                        } else {
                          setTurnoFin(3);
                        }
                      }}
                      sx={{ width: "150px" }}
                      label="Permisos"
                    ></TextField>
                  )}
                  onChange={(e, v) => setTOf(v.Codigo)}
                  sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                />
              </td>

              <td>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                  <DesktopDatePicker
                    label="Fecha Fin"
                    value={FechaFin}
                    onChange={(e) => {
                      setFechaFin(e);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </td>

              <td>
                <TextField
                  value={D3}
                  label="D3"
                  sx={{ marginLeft: 2, marginTop: 2, width: "85px" }}
                ></TextField>
              </td>
              <td>
                <TextField
                  value={D6}
                  label="D6"
                  sx={{ marginLeft: 2, marginTop: 2, width: "85px" }}
                ></TextField>
              </td>
            </tr>
          </table>
        </div>
      </Resizable>
    </Fragment>
  );
}
