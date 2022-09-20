import React, { Fragment } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { DateTime } from 'luxon';

import { useEffect } from 'react';
import axios from 'axios';
import { set } from 'date-fns';
import './Trazabilidad.css'
export default function TrazabilidadRegPlanta() {
  
  //UseStates
  const [DatosTrazabilidad, setDatosT] = useState([]);
  const [DatosResumen, SetDatosResumen]=useState([]);
  const [Fechas,setFechas]= useState([])
  //GET 
  useEffect(
    () => {
      axios
        .get(
          `http://192.168.0.118:4001/RegistroPlanta/Trazabilidad/${sessionStorage.getItem('OF')}`
        )
        .catch((error) => console.log(error))
        .then((response) => {
          console.log(response.data);
          SetDatosResumen(response.data.DatosResumen)
          setDatosT(response.data.Trazabilidad);
          setFechas(response.data.Fechas)
        });
    },
    []
  ) 
  
  /**
   * Recibe una fecha completa (formato yyyy-mm-ddT00:00:0000Z) y la convierte a formato simple dd/mm/yy
   * @param {String} d 
   */
  function FechaCleaner(d){
    if( d !== null){
      var full_date = String(d)
      var [f, resto] = full_date.split('T')
      var [year, month, day] = f.split('-')
      return `${day}/${month}/${year}`
      console.table(DatosTrazabilidad)
    }
    else{
      return 'dd/mm/yyyy'
    }
  }

  return (
    <Fragment>
      <form>
        <div className="centerBoxT">
          <br />
          <div className="spacedDivT">
            <Typography fontSize={"18px"}>
              <span className="spacedSpanT">
                OF{" "}
                <span className="solidBorderSpanT">
                  {sessionStorage.getItem("OF")}
                </span>
              </span>
              <span className="spacedSpanT">
                Producto{" "}
                <span className="solidBorderSpanT">{Fechas.ProductoID}</span>
              </span>
              <span className="spacedSpanT">
                Enviado Por <span className="solidBorderSpanT">COR</span>
              </span>
              <br />
              <br />
              <span className="spacedSpanT">
                Fecha de Inicio
                <span className="solidBorderSpanT">
                  {FechaCleaner(Fechas.FechaInicio)}
                </span>
              </span>
              <span className="spacedSpanT">
                Fecha de Finalizacion{" "}
                <span className="solidBorderSpanT">
                  {FechaCleaner(Fechas.FechaFin)}
                </span>
              </span>
            </Typography>
          </div>
          <br />
        </div>

        <br />
        <br></br>

        <div className="divTablaT">
          <table>
            <tbody>
              <tr>
                <th className="thT">
                  <Typography fontSize={"20px"}>Fecha</Typography>
                </th>
                <th className="thT">
                  <Typography fontSize={"20px"}>Turno</Typography>
                </th>
                <th className="thT">
                  <Typography fontSize={"20px"}>Producto</Typography>
                </th>
                <th className="thT">
                  <Typography fontSize={"20px"}>Palet</Typography>
                </th>
                <th className="thT">
                  <Typography fontSize={"20px"}>Cantidad</Typography>
                </th>
                <th className="thT">
                  <Typography fontSize={"20px"}>Resto</Typography>
                </th>
              </tr>
              {DatosTrazabilidad.map((i, n) => {
                return (
                  <Fragment>
                    <tr>
                      <td className="tdT" key={n++}>
                        <Typography fontSize={"18px"}>
                          {FechaCleaner(i.Fecha)}
                        </Typography>
                      </td>
                      <td className="tdT" key={n++}>
                        <Typography fontSize={"18px"} textAlign={"center"}>
                          {i.Turno}
                        </Typography>
                      </td>
                      <td key={n++} className="tdT">
                        <Typography fontSize={"18px"} textAlign={"center"}>
                          {i.Producto}
                        </Typography>
                      </td>
                      <td key={n++} className="tdT">
                        <Typography fontSize={"18px"} textAlign={"center"}>
                          {i.Palet}
                        </Typography>
                      </td>
                      <td key={n++} className="tdT">
                        <Typography fontSize={"18px"} textAlign={"center"}>
                          <input
                            className="inputT"
                            value={i.Cantidad | 0}
                            onChange={(e) => {
                              setDatosT(
                                DatosTrazabilidad.map((j) =>
                                  j.ID === i.ID
                                    ? { ...j, Cantidad: e.target.value }
                                    : j
                                )
                              );
                            }}
                          />
                        </Typography>
                      </td>
                      <td key={n++} className="tdT">
                        <Typography fontSize={"18px"} textAlign={"center"}>
                          <input
                            className="inputT"
                            value={i.Resto | ''}
                            onChange={(e) => {
                              setDatosT(
                                DatosTrazabilidad.map((j) =>
                                  j.ID === i.ID
                                    ? { ...j, Resto: e.target.value }
                                    : j
                                )
                              );
                            }}
                          />
                        </Typography>
                      </td>
                      <td>
                        <button>Modificar</button>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </form>
    </Fragment>
  );
}
