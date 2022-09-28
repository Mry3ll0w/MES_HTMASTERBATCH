import React, { Fragment } from 'react'
import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import {useReactToPrint} from 'react-to-print'
import { useEffect,useRef } from 'react';
import axios from 'axios';

import './Trazabilidad.css'
export default function TrazabilidadRegPlanta() {

  //HOOKS GENERALES
  const ComponentRef= useRef();

  //UseStates
  const [DatosTrazabilidad, setDatosT] = useState([]);
  const [DatosResumen, SetDatosResumen]=useState([]);
  const [Fechas,setFechas]= useState([])
  const [EnvP,SetEnvP] = useState('')
  const [TotalEnsacado,SetTotalEnsacado] = useState(0);
  const [Comentario,SetComentario]=useState('')
  const [Resto,SetResto]=useState(0)
  
  //GET 
  useEffect(
    () => {
      axios
        .get(
          `http://${process.env.REACT_APP_SERVER}/RegistroPlanta/Trazabilidad/${sessionStorage.getItem('OF')}`
        )
        .catch((error) => console.log(error))
        .then((response) => {
          console.log(response.data);
          SetDatosResumen(response.data.DatosResumen)
          setDatosT(response.data.Trazabilidad);
          setFechas(response.data.Fechas)
          SetEnvP(response.data.EnPor)
          SetComentario(response.data.Comentario)
          SetTotalEnsacado(response.data.TotalEnsacado)
          SetResto(parseFloat(response.data.Resto))
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
      
    }
    else{
      return 'dd/mm/yyyy'
    }
  }

  /**
   * Gestiona la actualizacion de un unico elemento de la trazabilidad
   * @param {Trazabilidad} t 
   */
  function UpdateTrazabilidad(t){
    axios.post(`http://${process.env.REACT_APP_SERVER}/RegistroPlanta/UpdateTrazabilidad`, {Trazabilidad: t}).catch( e => console.table(e))
    .then(window.location.reload(false))
    
    
  }

  
  const HandlePrint = useReactToPrint({content : () => ComponentRef.current,});

  
  //Main body
  return (
    <Fragment>
      <Button
        variant="contained"
        onClick={() => {
          HandlePrint();
        }}
        sx={{ margin: "10px" }}
      >
        Imprimir la pagina
      </Button>
      
      <div ref={ComponentRef}>
        <div className="centerBoxT">
          <br />
          <div className="spacedDivT">
            <Typography fontSize={"18px"}>
              <span className="spacedSpanT">
                OF
                <span className="solidBorderSpanT">
                  {sessionStorage.getItem("OF")}
                </span>
              </span>
              <span className="spacedSpanT">
                Producto{" "}
                <span className="solidBorderSpanT">{Fechas.ProductoID}</span>
              </span>
              <span className="spacedSpanT">
                Enviado Por <span className="solidBorderSpanT">{EnvP}</span>
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
                            value={i.Resto}
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
                      <td key={n++}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            UpdateTrazabilidad(i);
                          }}
                          sx={{
                            displayPrint: 'none'
                          }}
                        >
                          Modificar
                        </Button>
                      </td>
                    </tr>
                  </Fragment>
                );
              })}
              <tr></tr>
              <tr>
                <td key={1}></td>
                <td key={2}></td>
                <td key={3}></td>
                <td key={4}></td>
                <td key={6}>
                  <Typography fontSize={"18px"}>
                    Total Ensacado {TotalEnsacado}
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <br />
        <div className='newPage'>
          <div className="divTablaAzulT">
            <br />

            <Typography fontSize={"18px"}>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <span className="spacedSpanT">
                        SCADA{" "}
                        <span className="solidBSpanT">
                          {DatosResumen.Produccion}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="spacedSpanT">
                        Seleccion{" "}
                        <span className="solidBSpanT">
                          {DatosResumen.Seleccion}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="spacedSpanT">
                        Rechazo{" "}
                        <span className="solidBSpanT">
                          {DatosResumen.Rechazo}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="spacedSpanT">
                        Desperdicio{" "}
                        <span className="solidBSpanT">
                          {DatosResumen.Desperdicio}
                        </span>
                      </span>
                    </td>
                  </tr>

                  <br />
                  <tr>
                    <td>
                      <span className="spacedSpanT">
                        NAV{" "}
                        <span className="solidBSpanT">
                          {TotalEnsacado +
                            Resto +
                            DatosResumen.Rechazo +
                            DatosResumen.Plasta}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="spacedSpanT">
                        Ensacado{" "}
                        <span className="solidBSpanT">
                          {TotalEnsacado + Resto}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="spacedSpanT">
                        Rechazo{" "}
                        <span className="solidBSpanT">
                          {DatosResumen.Rechazo}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="spacedSpanT">
                        Plasta{" "}
                        <span className="solidBSpanT">
                          {DatosResumen.Plasta}
                        </span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Typography>
            <br />

            <Typography fontSize={"20px"} textAlign={"center"}>
              Comentarios:
            </Typography>
            <br />
            <textarea
              value={Comentario}
              defaultValue={"No hay comentarios asociados"}
              className="ComentarioT"
            />
            <br />
            <Typography fontSize={"20px"} textAlign={"center"}>
              Observaciones:
            </Typography>
            <br />
            <textarea
              value={Fechas.Observaciones}
              defaultValue={"No hay observaciones asociadas"}
              className="TextoT"
            />
            <br />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
