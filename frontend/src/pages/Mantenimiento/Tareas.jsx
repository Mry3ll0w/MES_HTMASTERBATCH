import React, { Fragment, useEffect } from 'react'
import {Autocomplete,TextField, Typography, Accordion, AccordionDetails, AccordionSummary} from '@mui/material'
import './Tareas.css'
import axios from 'axios'
import { useState } from 'react';
import Select from 'react-select'

function handleMaquina(t){
  axios
    .post(`http://${process.env}/Mantenimiento/Tareas`, {
      c1: t,
    })
    .catch((e) => console.log(e))
    .then((response) => {
      console.log(response);
    });
}

export default function MantenimientoTareas() {
  
  //useStates
  const [EsSeguimiento, SetEsSeguimiento] = useState(false);
  const [COD1Maquinas, SetCOD1Maquinas] = useState([]);
  const [SelMaquina,SetSelMaquina] = useState();
  const [SelCategoria, SetSelCategoria] = useState([]);
  const [SelCOD1,SetCOD1] = useState('Seleccioname')
  //Valores de Select
  const S_Seg= [
    {
      value: 1, label: 'Si'
    },
    {
      value: 2, label: 'No'
    }
  ]

  useEffect(()=>{
    axios.get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas`)
    .catch( e => console.log(e))
    .then(response => {
      console.log(response.data)
      //Preparamos las maquinas para el select
      var tCOD1 = []
      
      response.data.Maquinas.map( (i,n) => {
        tCOD1 = [...tCOD1, i.COD1NOMBRE];
      })
      SetCOD1Maquinas(tCOD1)
    })
  },[])

  return (
    <Fragment>
      <div className="MenuDiv">
        <Typography fontSize={"25px"}>Tareas y Seguimientos</Typography>
      </div>
      <div className="AccordionDiv">
        <br />
        <Accordion sx={{ margin: "1%" }}>
          <AccordionSummary>
            <Typography fontSize={"20px"} sx={{ textAlign: "center" }}>
              Creacion de nuevo Seguimiento/Tarea
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="FormNewTarea">
              <Typography fontSize={"16px"}>¿Es un seguimiento?</Typography>
              <Select
                className="SmallSelect"
                options={S_Seg}
                defaultValue={S_Seg[0]}
              />
              <br />
              <Typography fontSize={"16px"}>
                Selecciona el COD1 de la máquina
              </Typography>
              <Autocomplete
                value={SelCOD1}
                isOptionEqualToValue={(option, value) => option === value}
                options={
                  COD1Maquinas
                }
                renderInput={(e) => (
                  <TextField
                    {...e}
                    value={SelCOD1}
                    onChange={(e) => SetCOD1(e.target.value)}
                    sx={{ width: "100", m: "3px", p: "3px", minWidth: 200 }}
                    label="Turno"
                  ></TextField>
                )}
              >
              </Autocomplete>
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
