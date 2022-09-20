import React, { Fragment } from 'react'
import { Button, TextField } from '@mui/material'
import { useState } from 'react'
import { DateTime } from 'luxon';
import { format_date_guion } from '../pages/grafica_estadistico';
import { useEffect } from 'react';
import axios from 'axios';
import { set } from 'date-fns';
export default function TrazabilidadRegPlanta() {
  
  let Struct_Trazabilidad = {
    Fecha : "00/00/0000",
    Turno : "turno",
    Producto : "",
    Palet : "",
    Cantidad : 0,
    Resto : 0,
    OF : ''
  };

  const [DatosTrazabilidad, setDatosT] = useState({
    Fecha: '',
    Turno: '',
    Producto: '',
    Palet: '',
    Cantidad: '',
    Resto: '',
    OF: '',
  });
  
  

  useEffect(
    () => {
      //alert("Bienvenido al Registro de Planta, seleccione con DOBLE click el elemento de la lista que desea tratar")
      axios
        .get(
          `http://192.168.0.118:4001/RegistroPlanta/Trazabilidad/${sessionStorage.getItem('OF')}`
        )
        .catch((error) => console.log(error))
        .then((response) => {
          console.log(response.data);
          setDatosT({ OF: sessionStorage.getItem("OF") });

          console.table(DatosTrazabilidad)
          //setDatosT({ OF: sessionStorage.getItem("OF") });
          
        });
    },
    []
  ) 

  return (
    <Fragment>
      <form>
        <div>{DatosTrazabilidad.OF}</div>
        <div>
          <input value={DatosTrazabilidad.OF} onChange = {e => setDatosT({OF : e.target.value})} />
        </div>
      </form>
    </Fragment>
  );
}
