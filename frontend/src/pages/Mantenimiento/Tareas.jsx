import React, { Fragment, useEffect } from 'react'
import {Select, Pagination,Autocomplete,TextField,Button, Typography, Accordion, AccordionDetails, AccordionSummary, MenuItem} from '@mui/material'
import './Tareas.css'
import axios from 'axios'
import { useState } from 'react';
import {DateTime} from 'luxon'


export default function MantenimientoTareas() {
  
  //useStates
  const [Codigo, SetCodigo] = useState('______')
  const [COD1Maquinas, SetCOD1Maquinas] = useState([]);
  const [SelMaquina,SetSelMaquina] = useState();
  const [MaquinasFiltradas, SetMaquinasFiltradas] = useState([])
  const [SelCOD1,SetCOD1] = useState('Seleccioname')
  const [Descripcion,SetDescripcion] = useState('')
  const [Observacion, SetObservacion] = useState('')
  const [NEquipoID, SetNEquipoID] = useState(0)
  const [NextID, SetNextID] = useState(0)
  const [CriticidadID,SetCriticidadID] = useState(1)
  const [CategoriaID, SetCategoriaID] = useState(3)
  const [EstadoTareaID, SetEstadoTareaID] = useState(1)
  //Acciones
  const [PaginaAcciones,SetPaginaAcciones] = useState(1)
  const [NFecha, SetNFecha] = useState()
  const [NDescripcionEmpleado, SetNDescripcionEmpleado] = useState('')
  const [NObservacionesEmpleado, SetNObservacionesEmpleado] = useState('')

  //DataFetch y carga inicial de useStates
  useEffect(()=>{
    axios.get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas`)
    .catch( e => console.log(e))
    .then(response => {
      //Preparamos las maquinas para el select
      var tCOD1 = []
      
      response.data.Maquinas.map( (i,n) => {
        tCOD1 = [...tCOD1, i.COD1NOMBRE];
      })
      SetCOD1Maquinas(tCOD1)
      console.log(response.data)
      SetNextID(response.data.NextID.NextID)
    })

    
    if(!window.location.href.includes('Mantenimiento')){
      SetObservacion(`Tarea creada en Planta por ${sessionStorage.getItem('iniciales')}` )
    }
    else{
      SetObservacion(`Tarea creada en Mantenimiento por ${sessionStorage.getItem('iniciales')}, cargo de ${sessionStorage.getItem('Formulario')}`)
    }

    //Metemos la fecha actual 
    const Actual= DateTime.now().c;

    SetNFecha(`${Actual.year}-${Actual.month}-${Actual.day}`)

      
  },[])

  //Internal functions

  /**
   * Funcion para mostrar página que toca dentro de la parte derecha (acciones/consumo de materiales)
   * @param {Int} Pagina 
   */
  function DispAcciones(Pagina, EmpleadosAsignados, EsModificacion){
    if(Pagina === 1){
      
      return (
        <Fragment>
          <Typography fontSize={"18px"}>
            <p textAlign="center" style={{ marginLeft: "20px" }}>
              Empleados y Tiempo
            </p>
          </Typography>

          <table style={{ marginLeft: "20px" }}>
            <tbody>
              <tr>
                <th className="EmpleadosTh">
                  <Typography fontSize={"14px"}>Emp</Typography>
                  {/**Codigo E*** */}
                </th>
                <th className="EmpleadosTh">
                  <Typography fontSize={"14px"}>Alias</Typography>
                </th>
                <th className="EmpleadosTh">
                  <Typography fontSize={"14px"}>Nombre</Typography>
                </th>
                <th className="EmpleadosTh">
                  <Typography fontSize={"14px"}>Apellidos</Typography>
                </th>
                <th className="EmpleadosTh">
                  <Typography fontSize={"14px"}>Tiempo</Typography>
                </th>
              </tr>
            </tbody>
          </table>
        </Fragment>
      );
    }
    else if(Pagina === 2){

    }
  }

  return (
    <Fragment>
      <div className="AccordionDiv">
        <br />
        <Accordion sx={{ margin: "1%" }}>
          <AccordionSummary sx={{ border: "1px solid black" }}>
            <Typography fontSize={"20px"} sx={{ textAlign: "center" }}>
              Creacion de nuevo Seguimiento/Tarea
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="FormNewTarea">
              <br />
              <table>
                <tbody>
                  <tr>
                    <th className="customTh">
                      <Typography fontSize={"16px"}>
                        Criticidad de Tarea
                      </Typography>
                    </th>
                    <th className="customTh">
                      <Typography fontSize={"16px"}>
                        Categoría De Tarea
                      </Typography>
                    </th>
                    <th className="customTh">
                      <Typography fontSize={"16px"}>
                        Estado De La Tarea
                      </Typography>
                    </th>
                  </tr>
                  <tr>
                    <td>
                      <Select
                        value={CriticidadID}
                        onChange={(e) => {
                          SetCriticidadID(e.target.value);
                        }}
                        sx={{ width: "165px" }}
                      >
                        <MenuItem value={1}>Sin definir</MenuItem>
                        <MenuItem value={2}>Alta</MenuItem>
                        <MenuItem value={3}>Media</MenuItem>
                        <MenuItem value={4}>Baja</MenuItem>
                      </Select>
                    </td>
                    <td>
                      <Select
                        value={CategoriaID}
                        onChange={(e) => {
                          SetCategoriaID(e.target.value);
                        }}
                        sx={{ width: "165px" }}
                      >
                        <MenuItem value={1}>Producción</MenuItem>
                        <MenuItem value={2}>Auxiliar</MenuItem>
                        <MenuItem value={3}>Mantenimiento</MenuItem>
                      </Select>
                    </td>
                    <td>
                      <Select
                        value={EstadoTareaID}
                        onChange={(e) => {
                          SetEstadoTareaID(e.target.value);
                        }}
                        sx={{ width: "165px" }}
                      >
                        <MenuItem
                          value={1}
                          sx={{ background: "#FF5252", textAlign: "center" }}
                        >
                          <Typography
                            sx={{ background: "#FF5252", textAlign: "center" }}
                          >
                            Pendiente
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          value={2}
                          sx={{ background: "#7FCC72", textAlign: "center" }}
                        >
                          <Typography
                            sx={{ background: "#7FCC72", textAlign: "center" }}
                          >
                            Realizada
                          </Typography>
                        </MenuItem>
                      </Select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <table>
                <tbody>
                  <tr>
                    <th className="customTh">
                      <Typography fontSize={"16px"}>
                        Selecciona el equipo
                      </Typography>
                    </th>
                  </tr>
                  <tr>
                    <td>
                      <Autocomplete
                        value={SelCOD1}
                        //isOptionEqualToValue={(option, value) => option === value}
                        options={COD1Maquinas}
                        onChange={(e, v) => {
                          SetCOD1(v);
                          SetSelMaquina(null);
                          SetCodigo("_____");
                          if (v !== null) {
                            axios
                              .post(
                                `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas`,
                                { COD1: v }
                              )
                              .catch((error) => console.log(error))
                              .then((reply) => {
                                try {
                                  var StrMaquinas = [];
                                  reply.data.FilteredMaquina.map((i) => {
                                    StrMaquinas = [
                                      ...StrMaquinas,
                                      `${i.Código} | ${i.COD2Nombre} | ${i.COD2} | ${i.MaquinaID}`,
                                    ];
                                  });
                                  SetMaquinasFiltradas(StrMaquinas);
                                } catch {
                                  console.log("Error en datos recibidos");
                                }
                              });
                          }
                        }}
                        renderInput={(e) => (
                          <TextField
                            {...e}
                            value={COD1Maquinas}
                            sx={{
                              width: "120px",
                              m: "3px",
                              p: "3px",
                              minWidth: 200,
                            }}
                          ></TextField>
                        )}
                      ></Autocomplete>
                    </td>
                    <td>
                      <Autocomplete
                        value={SelMaquina}
                        key={SelMaquina === null}
                        //isOptionEqualToValue={(option, value) => option === value}
                        options={MaquinasFiltradas}
                        onChange={(e, v) => {
                          //Comprobamos que formato tiene el codigo
                          var [code, , , eqID] = v.split(" | ");
                          //Generado el codigo usando el formato de planta
                          SetCodigo(`TP${code}-${NextID}`);
                          SetSelMaquina(v);
                          //Guardamos el EquipoID
                          SetNEquipoID(eqID);
                        }}
                        renderInput={(e) => (
                          <TextField
                            {...e}
                            value={SelMaquina}
                            sx={{
                              width: "340px",
                              m: "3px",
                              p: "3px",
                              minWidth: 200,
                            }}
                          ></TextField>
                        )}
                      ></Autocomplete>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Typography fontSize={"16px"}>Descripción:</Typography>
              <br />
              <textarea
                className="Descripcion"
                value={Descripcion}
                onChange={(e) => SetDescripcion(e.target.value)}
              ></textarea>
              <br />
              <Typography fontSize={"16px"}>Observacion:</Typography>
              <br />
              <textarea
                className="Observacion"
                value={Observacion}
                onChange={(e) => SetObservacion(e.target.value)}
              ></textarea>
              <br />
              <Button variant="contained" sx={{ margin: "10px" }}>
                Crear Tarea con Codigo : {Codigo}
              </Button>
            </div>
            <div className="AccionesDiv">
              <br />
              <div className="BoxPagina">
                <Typography fontSize={"16px"}>
                  Descripcion del Empleado:
                  <span className="FechaRealizacion">
                    Fecha Creación:
                    <input
                      className="inputFecha"
                      type={"date"}
                      value={NFecha}
                      onChange={(e) => SetNFecha(e.target.value)}
                    />
                  </span>
                </Typography>
                <textarea
                  className="DescripcionEmpleado"
                  value={NDescripcionEmpleado}
                  onChange={(e) => {
                    SetNDescripcionEmpleado(e.target.value);
                  }}
                />
                <br />
                <Typography fontSize={"16px"}>
                  Observaciones del Empleado:
                </Typography>
                <textarea
                  className="ObservacionEmpleado"
                  value={NObservacionesEmpleado}
                  onChange={(e) => {
                    SetNObservacionesEmpleado(e.target.value);
                  }}
                />
                <div className="WrapperAcciones">
                  {DispAcciones(PaginaAcciones)}
                  <Pagination
                    count={2}
                    onChange={(e, p) => {
                      SetPaginaAcciones(p);
                    }}
                  />
                  <br />
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion sx={{ margin: "1%" }}>
          <AccordionSummary>
            <Typography fontSize={"20px"} sx={{ textAlign: "center" }}>
              Modificación de Seguimientos/Tareas/Acciones
            </Typography>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </Accordion>
        <br />
      </div>
    </Fragment>
  );
}
