import { Autocomplete,Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import '../Style/AdminUsers.css'
import axios from 'axios'
import Select from 'react-select'
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
  const Tratamientos = [
    { value: "1", label: "Don" },
    { value: "2", label: "Doña" },
    { value: "3", label: "Señor" },
    { value: "4", label: "Señora" },
  ];

  const Cargos =[
    {value: "1", label: "Gerente-Director Técnico"},
    {value: "2", label: "Administración General"},
    {value: "3", label: "Jefe De Producción"},
    {value: "4", label: "Jefe De Turno"},
    {value: "5", label: "Técnico Comercial"},
    {value: "6", label: "Técnico I+D"},
    {value: "7", label: "Jefe De Mantenimiento"},
    {value: "8", label: "Técnico Contable"},
    {value: "9", label: "Operario-Ofical 2º"},
    {value: "10", label: "Operario-Ofical 3º NoLogin"},
    {value: "11", label: "Sin Cargo Con Login"},
    {value: "12", label: "Sin Cargo Sin Login"},
  ]

  const EstadosContrato = [
    {value : '1', label: 'En Activo'},
    {value : '2', label: 'De baja'}
  ]

  //UseStates
  const [Usuarios, setUsuarios] = useState([])
  
  let Modificados = new Set()

  

  useEffect(() => {
    axios
      .get(
        `http://192.168.0.118:4001/AdmUsers`
      )
      .catch((error) => console.log(error))
      .then((response) => {
        try{
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
        <AccordionSummary
          sx={{
            backgroundColor: "#B6D0E1",
            textAlign: "center",
          }}
        >
          <Typography fontSize={"16px"} textAlign={"center"}>
            Edicion de los usuarios existentes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="wrap_div">
            <table>
              <tbody>
                <tr>
                  <th className="th_ADM">
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      {" "}
                      Código
                    </Typography>
                  </th>
                  <th className="th_ADM">
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      {" "}
                      Apellidos
                    </Typography>
                  </th>
                  <th className="th_ADM">
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      {" "}
                      Nombre
                    </Typography>
                  </th>
                  <th className="th_ADM">
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      Tratamiento
                    </Typography>
                  </th>
                  <th className="th_ADM">
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      Cargo
                    </Typography>
                  </th>
                  <th className="th_ADM">
                    <Typography fontSize={"20px"} textAlign={"center"}>
                      Estado del Contrato
                    </Typography>
                  </th>
                </tr>
                {Usuarios.map((i, n) => {
                  return (
                    <tr key={n++}>
                      <td className="td_ADM">
                        <input
                          value={i.Codigo}
                          onChange={(e) => {
                            //Guardamos en el set de los modificados
                            Modificados.add(i.ID);
                            //Guardamos los datos
                            setUsuarios(
                              Usuarios.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, Codigo: e.target.value }
                                  : j
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="td_ADM">
                        <input
                          value={i.Apellidos}
                          onChange={(e) => {
                            //Guardamos en el set de los modificados
                            Modificados.add(i.ID);
                            //Guardamos los datos
                            setUsuarios(
                              Usuarios.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, Apellidos: e.target.value }
                                  : j
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="td_ADM">
                        <input
                          value={i.Nombre}
                          onChange={(e) => {
                            //Guardamos en el set de los modificados
                            Modificados.add(i.ID);
                            //Guardamos los datos
                            setUsuarios(
                              Usuarios.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, Nombre: e.target.value }
                                  : j
                              )
                            );
                          }}
                        />
                      </td>
                      <td className="td_ADM">
                        <Select
                          options={Tratamientos}
                          onChange={(e) =>
                            setUsuarios(
                              Usuarios.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, TratamientoID: e.value }
                                  : j
                              )
                            )
                          }
                          defaultValue={Tratamientos[i.TratamientoID - 1]}
                        />
                      </td>
                      <td className="td_ADM">
                        <Select
                          options={Cargos}
                          defaultValue={Cargos[i.CargoID - 1]}
                          onChange={(e) =>
                            setUsuarios(
                              Usuarios.map((j) =>
                                j.ID === i.ID ? { ...j, CargoID: e.value } : j
                              )
                            )
                          }
                        />
                      </td>
                      <td className="td_ADM">
                        <Select
                          options={EstadosContrato}
                          defaultValue={EstadosContrato[i.ContratoEstadoID - 1]}
                          onChange={(e) =>
                            setUsuarios(
                              Usuarios.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, ContratoEstadoID: e.value }
                                  : j
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            axios
                              .post(`http://192.168.0.118:4001/AdmUsers`, {
                                Usuario: i,
                              })
                              .catch((error) => console.log(error))
                              .then((response) => {
                                try {
                                  setUsuarios(response.data.Usuarios);
                                } catch {
                                  console.log(
                                    "Fallo en la recepcion de datos del servidor RUTA: AdmUsers "
                                  );
                                }
                              });
                          }}
                        >
                          Modificar Empleado
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AccordionDetails>
      </Accordion>
    </Fragment>
  );
}
