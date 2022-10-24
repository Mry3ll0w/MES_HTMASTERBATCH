import React, { Fragment, useState } from "react";
import Dropdown from "react-dropdown-select";
import { Pagination } from "@mui/material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";

export default function AccionTarea({
  OpEmpleados,
  OpMat,
  Materiales,
  Empleados,
  AccionID,
}) {
  //UseStates
  const [LocalEmpSel, SetLocalEmpSel] = useState([]);
  const [LocalMatSel, SetLocalMatSel] = useState([]);
  const [LocalEmpleados, SetLocalEmpleados] = useState([]);
  const [LocalMateriales, SetLocalMateriales] = useState([]);
  const [Pagina, SetPagina] = useState(1);
  //Datafetch

  function Update_Empleados(AccionID) {
    var empleados_seleccionados = [];
    LocalEmpleados.map((i) => {
      if (LocalEmpSel.filter((j) => j.value === i.ID).length > 0) {
        empleados_seleccionados.push(i);
      }
    });
    //Update a cada uno de los empleados

    if (empleados_seleccionados.length > 0) {
      empleados_seleccionados.map((i) => {
        axios
          .post(
            `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/UpdateEmpleadoAccion`,
            {
              Empleado: i,
              AccionID: AccionID,
            }
          )
          .catch((e) => console.error(e));
      });
    } else {
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/UpdateEmpleadoAccion`,
          {
            Empleado: "VACIO",
            AccionID: AccionID,
          }
        )
        .catch((e) => console.error(e));
    }
    alert("Empleados actualizados");
  }

  function UpdateMaterial(AccionID) {
    var materiales_seleccionados = [];
    LocalMateriales.map((i) => {
      if (LocalMatSel.filter((j) => j.value === i.ID).length > 0) {
        materiales_seleccionados.push(i);
      }
    });
    //Update a cada uno de los empleados
    if (materiales_seleccionados.length > 0) {
      materiales_seleccionados.map((i) => {
        axios
          .post(
            `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/UpdateMaterialAccion`,
            {
              Material: i,
              AccionID: AccionID,
            }
          )
          .catch((e) => console.error(e));
      });
    } else {
      // no se han seleccionado ningún elemento, por lo que se eliminan todos los materiales vinculados a la acción
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/UpdateMaterialAccion`,
          {
            Material: "VACIO",
            AccionID: AccionID,
          }
        )
        .catch((e) => console.error(e));
    }
    alert("Material Actualizado");
  }

  //Funcion para muestreo
  function DetallesAccion() {
    if (Pagina === 1) {
      return (
        <Fragment>
          <Typography fontSize={"18px"} sx={{ margin: "8px" }}>
            Empleados Implicados en la acción
          </Typography>
          <br />
          <Typography fontSize={"16px"} sx={{ margin: "8px" }}>
            Selecciona los empleados implicados
          </Typography>
          <br />

          <div>
            <Dropdown
              options={OpEmpleados}
              multi={true}
              style={{
                marginLeft: "10px",
                width: "600px",
                fontSize: "18px",
                position: "absolute",
              }}
              value={LocalEmpSel}
              onChange={(e) => {
                SetLocalEmpSel(e);
              }}
            />
            <br /> <br /> <br /> <br />
          </div>
          <br />
          <div className='TablaAcciones'>
            <table>
              <tbody>
                <tr>
                  <th className='EmpleadosTh'>
                    <Typography fontSize={"16px"}>Emp</Typography>
                  </th>
                  <th className='EmpleadosTh'>
                    <Typography fontSize={"16px"}>Alias</Typography>
                  </th>
                  <th className='EmpleadosTh'>
                    <Typography fontSize={"16px"}>Apellidos</Typography>
                  </th>
                  <th className='EmpleadosTh'>
                    <Typography fontSize={"16px"}>Nombre</Typography>
                  </th>
                  <th className='EmpleadosTh'>
                    <Typography fontSize={"16px"}>Tiempo</Typography>
                  </th>
                </tr>

                {LocalEmpleados.map((i) => {
                  if (LocalEmpSel.filter((j) => j.value === i.ID).length > 0) {
                    return (
                      <tr id={Math.random()}>
                        <td id={Math.random()} className='EmpleadosTd'>
                          {i.Codigo}
                        </td>
                        <td id={Math.random()} className='EmpleadosTd'>
                          {i.Alias}
                        </td>
                        <td id={Math.random()} className='EmpleadosTd'>
                          {i.Apellidos}
                        </td>
                        <td id={Math.random()} className='EmpleadosTd'>
                          {i.Nombre}
                        </td>
                        <td id={Math.random()} className='EmpleadosTd'>
                          <input
                            value={i.tiempo}
                            type='time'
                            onChange={(e) => {
                              SetLocalEmpleados(
                                LocalEmpleados.map((j) =>
                                  j.ID === i.ID
                                    ? { ...j, tiempo: e.target.value }
                                    : j
                                )
                              );
                            }}
                          />
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
            <br />
            <Button
              variant='contained'
              size='small'
              onClick={() => {
                Update_Empleados(AccionID);
              }}
            >
              Actualizar Empleados
            </Button>
          </div>
          <br />
        </Fragment>
      );
    } else if (Pagina === 2) {
      return (
        <Fragment>
          <div className='DivConsumoMateriales'>
            <Typography fontSize={"18px"} sx={{ margin: "8px" }}>
              Consumo de Material
            </Typography>
            <br />
            <Typography fontSize={"16px"} sx={{ margin: "8px" }}>
              Selecciona el material usado
            </Typography>
            <Dropdown
              options={OpMat}
              multi={true}
              value={LocalMatSel}
              style={{
                position: "absolute",
                width: "600px",
                marginBottom: "100px",
                marginLeft: "10px",
              }}
              onChange={(e) => {
                console.log(e);
                SetLocalMatSel(e);
              }}
            />
            <br /> <br /> <br />
            <div className='TablaAcciones'>
              <table>
                <tbody>
                  <tr>
                    <th className='EmpleadosTh'>
                      <Typography fontSize={"16px"}>ID Mat</Typography>
                    </th>
                    <th className='EmpleadosTh'>
                      <Typography fontSize={"16px"}>Cant</Typography>
                    </th>
                  </tr>

                  {LocalMateriales.map((i) => {
                    if (
                      LocalMatSel.filter((j) => j.value === i.ID).length > 0
                    ) {
                      return (
                        <tr>
                          <td className='EmpleadosTd'>
                            <Typography fontSize={"16px"}>{i.ID}</Typography>
                          </td>
                          <td className='EmpleadosTd'>
                            <input
                              className='MaterialesInput'
                              value={i.Cantidad}
                              onChange={(e) => {
                                SetLocalMateriales(
                                  LocalMateriales.map((j) =>
                                    j.ID === i.ID
                                      ? { ...j, Cantidad: e.target.value }
                                      : j
                                  )
                                );
                              }}
                            />
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
              <br />
              <Button
                variant='contained'
                size='small'
                onClick={() => UpdateMaterial(AccionID)}
              >
                Actualizar Materiales
              </Button>
            </div>
            <br />
          </div>
        </Fragment>
      );
    }
  }

  //Procedimiento
  return (
    <Fragment>
      <br />
      <Accordion>
        <AccordionSummary
          sx={{ textAlign: "center", border: "1px solid black" }}
          onClick={() => {
            axios
              .get(
                `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/DatosAccion/${AccionID}`
              )
              .catch((e) => console.log(e))
              .then((response) => {
                var t = [];

                if (response.data.Empleados !== undefined) {
                  response.data.Empleados.map((i) => {
                    t.push({ value: i.EmpleadoID, AccionID: i.AccionID });
                  });
                  SetLocalEmpSel(t);
                }
                t = [];
                if (response.data.MaterialesAccion !== undefined) {
                  response.data.MaterialesAccion.map((i) => {
                    t.push({ value: i.MaterialID, AccionID: i.AccionID });
                  });
                  SetLocalMatSel(t);
                }

                //Ponemos los Empleados en local empleados
                t = [];

                Empleados.map((i) => {
                  var e = i;
                  response.data.Empleados.forEach((j) => {
                    if (j.EmpleadoID === i.ID) {
                      var [, AccionTiempo] = j.AccionTiempo.split("T");
                      var [horas, minutos] = AccionTiempo.split(":");
                      AccionTiempo = `${horas}:${minutos}`;
                      e.tiempo = AccionTiempo;
                    }
                  });
                  t.push(e);
                });
                SetLocalEmpleados(t);
                t = [];

                Materiales.map((i) => {
                  var m = i;
                  response.data.MaterialesAccion.forEach((j) => {
                    if (i.ID === j.MaterialID) {
                      console.log(m);
                      m.Cantidad = j.CantidadMaterial;
                    }
                  });
                  t.push(m);
                });
                SetLocalMateriales(t);
              });
          }}
        >
          <Typography fontSize={"18px"} align='center'>
            Empleados Y Materiales
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{DetallesAccion()}</AccordionDetails>
        <div className='PaginationFooter'>
          <Pagination
            count={2}
            onChange={(e, p) => {
              SetPagina(p);
            }}
          />
        </div>
        <br />
      </Accordion>
      <br />
    </Fragment>
  );
}
