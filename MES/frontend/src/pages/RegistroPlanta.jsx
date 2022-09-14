import React,{useState,useEffect, Fragment} from 'react'
import axios from 'axios'
import { TextField,Button, Autocomplete, TextareaAutosize, Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { styles } from '../Style/styles';
import { DataGrid,GridToolbar, esES} from '@mui/x-data-grid';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import {Resizable} from 're-resizable';
import { DesktopDatePicker,LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from "date-fns/locale";

    //Recibe una cadena
    export function format_date(d){
      if(d !== null){
        var date = String(d)
        var [Fecha_completa, hora_completa] = date.split(':')
        var [Fecha_completa_corregida, basuraF] = Fecha_completa.split('T')
        var[year, month, day] = Fecha_completa_corregida.split('-')
        return `${day}/${month}/${year}`;
      }
      else
        return '';
    }

    export function format_hour(d){
      if (d !== null){
        var t = String(d)
        
        var [fecha, hora_completa] =  t.split('T')
        var str = String(hora_completa)
        
        var [horas, minutos, segundos] = str.split(':')
        
        return `${horas}:${minutos}`;
      }
      else
        return d;
    }

export default function RegistroPlanta() {
    var ResumenTurnos = {
      Produccion: 0,
      Rechazo: 0,
      Ensacado: 0,
      RechazoTA: 0,
      Seleccion: 0,
      Sel_Ens: 0,
      Desperdicio: 0,
      Plasta: 0,
    };
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
    const [Observaciones, setObservaciones] = useState('');
    const [EstadoEnsacado,setEstadoEnsacado]= useState('');
    const [ProcesoEstado, setProcesoEstado] = useState('');
    const [Permiso,setPermiso]= useState('');
    const [FechaFin,setFechaFin]= useState('');
    const [FechaInicio,setFechaInicio] = useState('');
    const [TurnoFin,setTurnoFin]= useState('');
    const [TurnoInicio,setTurnoInicio] = useState('');
    const [OF,setOF] = useState("");
    const [RState, setRState] = useState({ width: '80%', height: '630px' });//Estilo Dinamico
    //Variables para guardar los datos de los turnos (el valor final es numerico y el mostrado es string)
    const [DatosRegPlanta, setDatosRegPlanta] = useState([]);
    const [DatosResumen, setDatosResumentRegPlanta] = useState([])
    const [DatosRegPlantaComun, setDatosRegPlantaComun] = useState([]);
    const [DatosPlanta, setDatosPlanta] = useState([]);
    const [SelLista, setSelLista] = useState([]);
    const [DispTI, setDispTI] = useState("")
    const [DispTF, setDispTF] = useState("")
    const [DispPermisos, setDispPermisos] = useState("")
    const [DispTEns, setDispTEns] = useState("")
    const [ResTurno, setResTurno] = useState([]);
    
    //Para obtener los valores de los campos para el registro de la planta
    useEffect(()=>{
        //alert("Bienvenido al Registro de Planta, seleccione con DOBLE click el elemento de la lista que desea tratar")
        axios.get('http://192.168.0.118:4001/RegPlanta')
        .catch(error=>console.log(error))
        .then(response=>{
            setDatosPlanta(response.data.Datos)
        })
    },[])

    /**
     * @brief Funcion para pasar de int a cadena en turno
     * @param none
     * @return none
     */
    function asigna_turno(e){
      if(e === 1)
        return "Mañana"
      else if(e === 2)
        return "Tarde"
      else
        return "Noche"
    }

    /**
     * Devuelve el tipo de produccion según el numero
     * @param {int} s
     * @return String 
     */
    function asigna_tipo_produccion(s){
      if(s === 2)
        return "Producción | Producción dentro de un turno"
      else if(s === 3)
        return "Ensacado | Ensacado durante un turno"
      else
        return "Ajuste | SCADA:Incremental"
    }
    
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


    /**
     * Devuelve el estado en el que se encuentra la producción
     * @param {int} e 
     * @returns String
     */
    function asignar_Estado(e){
      if( e === 1)
        return "Sin iniciar | La OF no ha sido cerrada"
      else if(e === 2 )
        return "Arrancada | La Producción ha comenzado"
      else  
        return "Finalizada | La Producción ha finalizado"
    }
  
    /**
     * Asigna el permiso, o por quien ha sido aprobado
     * @param {int} e 
     * @returns 
     */
    function asignar_permisos(e){
      if( e === 1)
        return "Planta | Registro agreado en Planta"
      else if(e == 2)
        return "Aprobado | Registro aprobado por Dpto."
      else
          return "Bloqueado | Registro Desechado"
    }

    /**
     * Se encarga de realizar el calculo de la parte superior del resumen
     */
    function calcula_resumen_superior(){
      //Buscamos 
    }
    
    DatosPlanta.map((i,n)=>{
            i.id = n++;
            i.FechaHoraRegInicio = format_date(i.FechaHoraRegInicio);
            i.FechaFin = format_date(i.FechaFin);
            i.FechaInicio = format_date(i.FechaInicio);
            
        }
    );
    
    
  return (
    <Fragment>
      <div style={styles.AdjustableLeftBox}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={DatosPlanta}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={100}
          //loading = {true}
          //checkboxSelection
          rowsPerPageOptions={[10]}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = DatosPlanta.filter((row) =>
              selectedIDs.has(row.id)
            );
            //console.log(selectedRowData);
            //Guardar datos del seleccionado en la lista
            setSelLista(
              DatosPlanta.filter((i) => {
                return i.OF === selectedRowData[0].OF;
              })
            );
            //Seleccion del ensacado, filtramos por OF y TurnoID (1,2,5)
            axios
              .post("http://192.168.0.118:4001/RegPlanta", {
                OF: selectedRowData[0].OF,
              })
              .catch((error) => console.log(error))
              .then((r) => {
                //Correcion formato de Hora recibida
                console.log(r.data);
                setDatosRegPlanta(r.data.DatosRegPlanta);
                setDatosRegPlantaComun(r.data.DatosRegPlantaComun[0]);
                setDatosResumentRegPlanta(r.data.Resumen);
                setResTurno(r.data.ResumenTotal)
                //console.table(ResTurno)
                //Metemos los datos del registro de Planta Comun
                SetHoraInicio(
                  format_hour(DatosRegPlantaComun.FechaHoraRegInicio)
                );
                SetHoraFin(format_hour(DatosRegPlantaComun.FechaHoraRegFin));
                setD1(DatosRegPlantaComun.D1);
                setD2(DatosRegPlantaComun.D2);
                setD3(DatosRegPlantaComun.D3);
                setD4(DatosRegPlantaComun.D4);
                setD5(DatosRegPlantaComun.D5);
                setD6(DatosRegPlantaComun.D6);
                setFechaInicio(DatosRegPlantaComun.FechaInicio);
                setFechaFin(DatosRegPlantaComun.FechaFin);
                setObservaciones(DatosRegPlantaComun.Observacion);
                setOF(DatosRegPlantaComun.OrdenFabricacionID);
                setTOf(DatosRegPlantaComun.TipoOFID);
                setDispTEns(
                  DatosRegPlantaComun.TipoOFID == 1 ? "Normal" : "Prueba"
                );
                setTurnoFin(DatosRegPlantaComun.TurnoFinID);
                setTurnoInicio(DatosRegPlantaComun.TurnoInicioID);
                setDispTI(asigna_turno(TurnoInicio));
                setDispTF(asigna_turno(TurnoFin));
                setProcesoEstado(DatosRegPlantaComun.ProcesoEstadoID);
                setEstadoEnsacado(DatosRegPlantaComun.EnsacadoEstadoID);
                setPermiso(DatosRegPlantaComun.EstadoID);
                setDispPermisos(asignar_permisos(Permiso));
                
                //Calculo total del resumen del turno
                var t_res_turno = ResumenTurnos;
                r.data.ResumenTotal.map((i) => {
                  t_res_turno.Desperdicio = i.Desperdicio;
                  t_res_turno.Ensacado = i.Ensacado;
                  t_res_turno.Plasta = i.Plasta;
                  t_res_turno.Rechazo = i.Rechazo;
                  t_res_turno.RechazoTA = i.RechazoTA;
                  t_res_turno.Sel_Ens = i.Sel_Ens;
                  t_res_turno.Seleccion = i.Seleccion;
                });

                setResTurno(r.data.ResumenTotal);

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
            InputLabelProps={{ shrink: true }}
            sx={{ margin: 2, width: "400px" }}
            value={OF || ""}
            disabled={true}
            label="Orden de Fabricación"
            inputProps={{ style: { textAlign: "center" } }}
          />
          <div></div>
        </div>

        <div>
          <table>
            <td>
              <Autocomplete
                value={DispTI}
                options={["Mañana", "Tarde", "Noche"]}
                isOptionEqualToValue={(option, value) => option == value}
                renderInput={(e) => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    {...e}
                    value={DispTI}
                    onChange={(e) => {
                      setDispTI(e.target.value);
                      var str = String(e.target.value);
                      if (str.includes("M")) {
                        setTurnoInicio(1);
                      } else if (str.includes("T")) {
                        setTurnoInicio(2);
                      } else {
                        setTurnoInicio(3);
                      }
                    }}
                    sx={{ width: "150px" }}
                    label="Turno Inicio"
                  ></TextField>
                )}
                onChange={(e, v) => setDispTI(v)}
                sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
              />
            </td>
            <td>
              <TextField
                InputLabelProps={{ shrink: true }}
                sx={{ marginLeft: 2, width: "150px" }}
                label="H.Inicio"
                value={HoraInicio}
                onChange={(e) => SetHoraInicio(e.target.value)}
              />
            </td>

            <td>
              <Autocomplete
                value={DispTEns}
                isOptionEqualToValue={(option, value) => option == value}
                options={["Normal", "Prueba"]}
                //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                renderInput={(e) => (
                  <TextField
                    InputLabelProps={{ shrink: true }}
                    {...e}
                    value={DispTEns}
                    onChange={(e) => {
                      setTOf(e.target.value);
                      setTOf(DispTEns == "Normal" ? 1 : 2);
                    }}
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
                InputLabelProps={{ shrink: true }}
                sx={{ marginLeft: 2, width: "150px" }}
                label="H.Fin"
                value={HoraFin}
                onChange={(e) => SetHoraFin(e.target.value)}
              />
            </td>

            <td>
              <TextField
                InputLabelProps={{ shrink: true }}
                sx={{ marginLeft: 2, width: "100px" }}
                label="D1"
                value={D1}
              />
            </td>

            <td>
              <TextField
                InputLabelProps={{ shrink: true }}
                sx={{ marginLeft: 2, width: "100px" }}
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
                        InputLabelProps={{ shrink: true }}
                        {...params}
                        sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </td>

              <td>
                <Autocomplete
                  value={
                    EstadoEnsacado == 1
                      ? "Finalizado | Ensacado Terminado"
                      : "Pendiente | Ensacado pendiente de terminar "
                  }
                  options={[
                    "Finalizado | Ensacado Terminado",
                    "Pendiente | Ensacado pendiente de terminar ",
                  ]}
                  //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                  renderInput={(e) => (
                    <TextField
                      InputLabelProps={{ shrink: true }}
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
                  value={DispTF}
                  isOptionEqualToValue={(option, value) => option == value}
                  //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                  renderInput={(e) => (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      {...e}
                      value={DispTF}
                      onChange={(e) => {
                        setDispTF(DispTF);
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
              <td></td>
              <td>
                <TextField
                  value={D2}
                  label="D2"
                  InputLabelProps={{ shrink: true }}
                  sx={{ marginLeft: 2, marginTop: 2, width: "100px" }}
                ></TextField>
              </td>

              <td>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={D5}
                  label="D5"
                  sx={{ marginLeft: 2, marginTop: 2, width: "100px" }}
                ></TextField>
              </td>
            </tr>

            <tr>
              <td></td>
              <td>
                <Autocomplete
                  value={DispPermisos}
                  isOptionEqualToValue={(option, value) => option == value}
                  options={[
                    "Planta | Registro agreado en Planta",
                    "Aprobado | Registro aprobado por Dpto.",
                    "Bloqueado | Registro Desechado",
                  ]}
                  //getOptionLabel={(o) => {return `${o.Codigo}-${o.Nombre} ${o.Apellidos}`}}
                  renderInput={(e) => (
                    <TextField
                      InputLabelProps={{ shrink: true }}
                      {...e}
                      value={asignar_permisos(Permiso)}
                      onChange={(e) => {
                        var str = String(e.target.value);
                        if (str.includes("Planta")) {
                          setPermiso(1);
                        } else if (str.includes("Aprobado")) {
                          setPermiso(2);
                        } else {
                          setPermiso(3);
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
                        InputLabelProps={{ shrink: true }}
                        {...params}
                        sx={{ marginLeft: 2, marginTop: 2, width: "150px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </td>
              <td></td>
              <td>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={D3}
                  label="D3"
                  sx={{ marginLeft: 2, marginTop: 2, width: "100px" }}
                ></TextField>
              </td>
              <td>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={D6}
                  label="D6"
                  sx={{ marginLeft: 2, marginTop: 2, width: "100px" }}
                ></TextField>
              </td>
            </tr>
          </table>
          <br />

          <table>
            <tr>
              <td></td>
              <td>
                <h2>Observaciones:</h2>
                <TextareaAutosize
                  value={Observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  style={{
                    width: "700px",
                    fontSize: "16px",
                    marginLeft: 2,
                    marginTop: 2,
                  }}
                  placeholder="No existe una observacion"
                ></TextareaAutosize>
              </td>
            </tr>
          </table>
          {DatosRegPlanta.map((e) => {
            
            return (
              <Fragment>
                <br />
                <Accordion>
                  <AccordionSummary>
                    <Typography
                      sx={{
                        background: "#1876D2",
                        color: "white",
                        width: "100%",
                        height: "100%",
                        fontSize: "25px",
                      }}
                    >
                      Turno de {asigna_turno(e.TurnoID)} del día :{" "}
                      {format_date(e.FechaHoraReg)} registrada a las{" "}
                      {format_hour(e.FechaHoraReg)}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ marginLeft: "2px" }}>
                      <table>
                        <tr>
                          <td>
                            <TextField
                              value={asigna_tipo_produccion(e.ObjetoID)}
                              label="Tipo de Producción"
                              InputLabelProps={{ shrink: true }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <p style={{ fontSize: "30px" }}>
                            Turno de {asigna_turno(e.TurnoID)}
                          </p>
                        </tr>

                        <tr>
                          <td></td>
                          <th style={{ backgroundColor: "#DFE5ED" }}>SCADA</th>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              value={e.Produccion}
                              label="Producción"
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#DFE5ED",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="Selección"
                              value={e.Seleccion}
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#DFE5ED",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="Rechazo"
                              value={e.Rechazo}
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#DFE5ED",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="Desperdicio"
                              value={e.Desperdicio}
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#DFE5ED",
                              }}
                            />
                          </td>
                        </tr>

                        <tr style={{ margin: 2 }}>
                          <td></td>
                          <th style={{ backgroundColor: "#E6EDD7" }}>
                            Por Turno
                          </th>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="Ensacado"
                              value={e.Ensacado}
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#E6EDD7",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="Rechazo TA"
                              value={e.RechazoTA}
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#E6EDD7",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="Plasta"
                              value={e.Plasta}
                              sx={{
                                margin: "1px",
                                width: "150px",
                                backgroundColor: "#E6EDD7",
                              }}
                            />
                          </td>
                        </tr>
                      </table>

                      <br></br>
                      <p style={{ fontSize: "20px", marginLeft: "2px" }}>
                        Arr.
                      </p>
                      <table>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="S1"
                              value={e.ArrS1}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB1"
                              value={e.ArrBB1}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              label="BB2"
                              InputLabelProps={{ shrink: true }}
                              value={e.ArrBB2}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="SG1"
                              value={e.ArrSG1}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="SP2"
                              value={e.ArrSP2}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="SP3"
                              value={e.ArrSP3}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB3"
                              value={e.ArrBB3}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              value={e.ArrBB4}
                              label="BB4"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB5"
                              value={e.ArrBB5}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="LIQ"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="L2"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="L3"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ marginBottom: "3px" }}></td>
                        </tr>
                      </table>

                      <p style={{ fontSize: "20px", marginLeft: "2px" }}>
                        Ret.
                      </p>
                      <table>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="S1"
                              value={e.RetS1}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB1"
                              value={e.RetBB1}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB2"
                              value={e.RetBB2}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="SG1"
                              value={e.RetSG1}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="SP2"
                              value={e.RetSP2}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="SP3"
                              value={e.RetSP3}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB3"
                              value={e.RetBB3}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB4"
                              value={e.RetBB4}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="BB5"
                              value={e.RetBB5}
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="LIQ"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="L2"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              InputLabelProps={{ shrink: true }}
                              label="L3"
                              sx={{
                                margin: "1px",
                                width: "90px",
                              }}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ marginBottom: "3px" }}></td>
                        </tr>
                      </table>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <br />
              </Fragment>
            );
          })}
        </div>
        <br />
        <Accordion>
          <AccordionSummary>
            <Typography
              sx={{
                background: "#1876D2",
                color: "white",
                width: "100%",
                height: "100%",
                fontSize: "25px",
              }}
            >
              Resumen
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <table>
              {/**Para guardar los superiores */}
              <th>
                <Typography
                  sx={{ fontSize: "20px", backgroundColor: "#D6DCE5" }}
                >
                  TOTALES
                </Typography>
              </th>
              <tr>
                <td>
                  <TextField
                    label="Producción"
                    value={ResTurno.Produccion}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="Rechazo"
                    value={ResTurno.Rechazo}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="Ensacado"
                    value={ResTurno.Ensacado}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="RechazoTA"
                    value={ResTurno.RechazoTA}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <TextField
                    label="Selección"
                    value={ResTurno.Seleccion}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="Desperdicio"
                    value={ResTurno.Desperdicio}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="Sel-Ens"
                    value={ResTurno.Sel_Ens}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="Plasta"
                    value={ResTurno.Plasta}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <TextField
                    label="S1"
                    value={DatosResumen.S1}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    value={DatosResumen.BB1}
                    label="BB1"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="BB2"
                    value={DatosResumen.BB2}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="SG1"
                    value={DatosResumen.SG1}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="SP2"
                    value={DatosResumen.SP2}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="SP3"
                    value={DatosResumen.SP3}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <TextField
                    label="BB3"
                    value={DatosResumen.BB3}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="BB4"
                    value={DatosResumen.BB4}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="BB5"
                    value={DatosResumen.BB5}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  <TextField
                    label="LIQ"
                    value={DatosResumen.LIQ}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />
                </td>
                <td>
                  
                  <TextField
                    label="L2"
                    value={DatosResumen.L2}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />

                </td>
                <td>

                  <TextField
                    label="L3"
                    value={DatosResumen.L3}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100px", margin: 1 }}
                  />

                </td>
              </tr>
            </table>
            <table>{/**Guardar S1, bb1 ,... */}
            </table>
          </AccordionDetails>
        </Accordion>
      </Resizable>
    </Fragment>
  );
}
