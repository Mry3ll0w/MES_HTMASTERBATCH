import React, { Fragment, useState } from "react";
import Dropdown from "react-dropdown-select";
import { Typography } from "@mui/material";

export default function AccionTarea({
  OpEmpleados,
  Pagina,
  OpMat,
  Materiales,
  Empleados,
}) {
  //UseStates
  const [LocalEmpSel, SetLocalEmpSel] = useState([]);
  const [LocalMatSel, SetLocalMatSel] = useState([]);
  const [LocalEmpleados, SetLocalEmpleados] = useState(Empleados);
  const [LocalMateriales, SetLocalMateriales] = useState(Materiales);
  if (Pagina === 1) {
    return (
      <Fragment>
        <br />
        <Typography fontSize={"16px"} style={{ marginLeft: "10px" }}>
          Seleccione los empleados implicados en la tarea
        </Typography>
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
              console.log(e);
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

              {Empleados.map((i) => {
                if (LocalEmpSel.filter((j) => j.value === i.ID).length > 0) {
                  return (
                    <tr id={1 + i.ID}>
                      <td id={i.ID + 2} className='EmpleadosTd'>
                        {i.Codigo}
                      </td>
                      <td id={i.ID + 3} className='EmpleadosTd'>
                        {i.Alias}
                      </td>
                      <td id={i.ID + 4} className='EmpleadosTd'>
                        {i.Apellidos}
                      </td>
                      <td id={i.ID + 5} className='EmpleadosTd'>
                        {i.Nombre}
                      </td>
                      <td id={i.ID + 2} className='EmpleadosTd'>
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

                {Materiales.map((i) => {
                  if (LocalMatSel.filter((j) => j.value === i.ID).length > 0) {
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
          </div>
          <br />
          <br />
        </div>
      </Fragment>
    );
  }
}
