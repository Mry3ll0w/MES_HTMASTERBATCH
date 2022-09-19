import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import '../Style/AdminUsers.css'
import axios from 'axios'
export default function Personal() {
  const empleado = {
    ID : '',
    Codigo : '',
    Nombre : '',
    Apellidos : '',
    TratamientoID : 0,
    Alias : '',
    CargoID : 0,

  }
  const [Usuarios, setUsuarios] = useState([])
  const [Modificados, setModificados] = useState([])

  useEffect(() => {
    axios
      .get(
        `http://192.168.0.118:4001/AdmUsers`
      )
      .catch((error) => console.log(error))
      .then((response) => {
        try{
          console.log(response.data.Usuarios);
          setUsuarios(response.data.Usuarios)
          
        }
        catch{
          console.log("Fallo en la recepcion de datos del servidor RUTA: AdmUsers ")
        }
      });
  },[])

  return (
    <Fragment>
      <Typography fontSize={"20px"} textAlign={"center"}>
        Gestion de Usuarios del MES
      </Typography>
      <Accordion>
        <AccordionSummary>
          <Typography fontSize={"16px"} textAlign={"center"}>
            Edicion de los usuarios existentes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="wrap_div">
            <table>
              <tbody>
                <tr>
                  <th>
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      {" "}
                      Código
                    </Typography>
                  </th>
                  <th>
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      {" "}
                      Apellidos
                    </Typography>
                  </th>
                  <th>
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      {" "}
                      Nombre
                    </Typography>
                  </th>
                  <th>
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      Tratamiento
                    </Typography>
                  </th>
                  <th>
                    <Typography fontSize={"20px"} textAlign={"center"}>
                    Cargo
                    </Typography>
                  </th>
                </tr>
                {Usuarios.map((i) => {
                  return <tr></tr>;
                })}
              </tbody>
            </table>
          </div>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}
