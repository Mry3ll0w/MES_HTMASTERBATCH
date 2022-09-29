import React, { Fragment, useEffect } from 'react'
import {Autocomplete,TextField, Typography, Accordion, AccordionDetails, AccordionSummary} from '@mui/material'
import './Tareas.css'
import axios from 'axios'
import { useState } from 'react';
import Select from 'react-select'



export default function MantenimientoTareas() {
  
  //useStates
  const [EsSeguimiento, SetEsSeguimiento] = useState(true);
  const [Codigo, SetCodigo] = useState('______')
  const [COD1Maquinas, SetCOD1Maquinas] = useState([]);
  const [SelMaquina,SetSelMaquina] = useState();
  const [MaquinasFiltradas, SetMaquinasFiltradas] = useState([])
  const [SelCOD1,SetCOD1] = useState('Seleccioname')
  const [Descripcion,SetDescripcion] = useState('')
  const [Observacion, SetObservacion] = useState('')

  //Valores de Select
  const S_Seg= [
    {
      value: true, label: 'Si'
    },
    {
      value: false, label: 'No'
    }
  ]

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
    })

    //Comprobamos que si estamos en la version de planta no se genere la opcion de seguimiento
    SetEsSeguimiento(window.location.href.includes('Mantenimiento'))
    if(!window.location.href.includes('Mantenimiento')){
      SetObservacion('Tarea creada en Planta:')
    }
  },[])

  return (
    <Fragment>
      <div className="MenuDiv">
        <Typography fontSize={"25px"}>Tareas y Seguimientos</Typography>
      </div>
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
              <div hidden={!window.location.href.includes("Mantenimiento")}>
                {/** Para comprobar si estamos en planta y generamos un codigo distinto */}
                <Typography fontSize={"16px"}>¿Es un seguimiento?</Typography>
                <Select
                  className="SmallSelect"
                  options={S_Seg}
                  defaultValue={S_Seg[0]}
                  onChange={(e) => {
                    SetEsSeguimiento(e.value);
                  }}
                />
              </div>
              <br />
              <Typography fontSize={"16px"}>
                Selecciona el COD1 de la máquina
                <span className="CodeSpan">Codigo Generado: {Codigo}</span>
              </Typography>
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
                              `${i.COD2} | ${i.COD2Nombre} | ${i.Código}`,
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
                    sx={{ width: "100px", m: "3px", p: "3px", minWidth: 200 }}
                  ></TextField>
                )}
              ></Autocomplete>

              <br />
              <Typography fontSize={"16px"}>
                Selecciona el tipo de maquina
              </Typography>
              <Autocomplete
                value={SelMaquina}
                key={SelMaquina === null}
                //isOptionEqualToValue={(option, value) => option === value}
                options={MaquinasFiltradas}
                onChange={(e, v) => {
                  //Comprobamos que formato tiene el codigo
                  var [, , code] = v.split(" | ");
                  if (EsSeguimiento) {
                    //Generamos el codigo usando el formato adecuado para seg
                    SetCodigo(`MP${code}`);
                  } else {
                    //Generado el codigo usando el formato de planta
                    SetCodigo(`TP${code}`);
                  }
                }}
                renderInput={(e) => (
                  <TextField
                    {...e}
                    value={SelMaquina}
                    sx={{ width: "400px", m: "3px", p: "3px", minWidth: 200 }}
                  ></TextField>
                )}
              ></Autocomplete>
              <br />
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
                className="Descripcion"
                value={Observacion}
                onChange={(e) => SetObservacion(e.target.value)}
              ></textarea>
              <br />
            </div>
            <div className="AccionesDiv"></div>
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
