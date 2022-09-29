import React, { Fragment, useEffect } from 'react'
import {Autocomplete,TextField,Button, Typography, Accordion, AccordionDetails, AccordionSummary} from '@mui/material'
import './Tareas.css'
import axios from 'axios'
import { useState } from 'react';
import Select from 'react-select'



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
      
  },[])

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
                        Selecciona el COD1 de la máquina
                      </Typography>
                    </th>

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
                              width: "100px",
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
                          var [code, , ,eqID] = v.split(" | ");
                          //Generado el codigo usando el formato de planta
                          SetCodigo(`TP${code}-${NextID}`);
                          SetSelMaquina(v)
                          //Guardamos el EquipoID
                          SetNEquipoID(eqID)
                        }}
                        renderInput={(e) => (
                          <TextField
                            {...e}
                            value={SelMaquina}
                            sx={{
                              width: "300px",
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
                Crear Seguimiento
              </Button>
            </div>
            <div className="AccionesDiv">
              <br />
              <Typography fontSize={"16px"}>
                Codigo Generado: {Codigo}
              </Typography>
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
