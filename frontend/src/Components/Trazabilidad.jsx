import React from 'react'
import { Button } from '@mui/material'
import { useState } from 'react'
import { DateTime } from 'luxon';
import { format_date_guion } from '../pages/grafica_estadistico';
import { useEffect } from 'react';
import axios from 'axios';
export default function TrazabilidadRegPlanta() {
  
  const Struct_Trazabilidad = {
    Fecha : "00/00/0000",
    Turno : "turno",
    Producto : "",
    Palet : "",
    Cantidad : 0,
    Resto : 0,
    OF : ''
  };

  const [DatosTrazabilidad, setDatosT] = useState(Struct_Trazabilidad)
  
  DatosTrazabilidad.OF = sessionStorage.getItem('OF')

  useEffect(
    () => {
      //alert("Bienvenido al Registro de Planta, seleccione con DOBLE click el elemento de la lista que desea tratar")
      axios
        .get(`http://192.168.0.118:4001/RegistroPlanta/Trazabilidad/${DatosTrazabilidad.OF}`)
        .catch((error) => console.log(error))
        .then((response) => {
          console.log(response.data)
        });
    },
    []
  ) 

  return (
    <div>{DatosTrazabilidad.OF}</div>
  )
}
