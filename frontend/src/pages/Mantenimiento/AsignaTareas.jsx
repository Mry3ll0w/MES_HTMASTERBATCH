import React, { useEffect, useState, Fragment } from "react";
import Select from "react-select";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Button } from "@mui/material";
export default function AsignaTareas() {
  //UseStates
  var [aRDGTareas, SetaRDGTareas] = useState([]);
  var [aTareasSeleccionadas, SetaTareasSeleccionadas] = useState([]);
  var [iTiempoTotal, SetiTiempoTotal] = useState(0);
  var [aOpcionesEmpleados, SetaOpcionesEmpleados] = useState("");
  var [sEmpleadoAsignadoID, SetsEmpleadoAsignadoID] = useState(-1);
  var [dtFProgramada, SetdtFProgramada] = useState("");
  //Functions
  function AssignTask() {
    //Comprobacion de Errores
    var bErrores = false;

    if (aTareasSeleccionadas.length === 0) {
      bErrores = true;
      alert("Antes de asignar las tareas seleccione las mismas");
    }
    if (sEmpleadoAsignadoID === -1) {
      bErrores = true;
      alert("Seleccione al trabajador antes de asignar las tareas");
    }

    if (dtFProgramada === "") {
      bErrores = true;
      alert("Debe seleccionar una fecha aproximada");
    }

    if (iTiempoTotal >= 480) {
      alert("Va a asignar mas de 480 minutos a un empleado, tengalo en cuenta");
    }

    if (!bErrores) {
      aTareasSeleccionadas.forEach((i) => {
        axios
          .post(
            `http://${process.env.REACT_APP_SERVER}/Mantenimiento/AsignarTareas`,
            {
              TareaID: i.ID,
              EmpleadoApoyo: i.iEmpleadoApoyoID,
              FechaProgramada: dtFProgramada,
              EmpleadoAsignado: sEmpleadoAsignadoID,
            }
          )
          .catch((e) => {
            console.log(e);
            bErrores = true;
          });
      });

      //Si existen errores de insercion de tareas se mostraran en la alerta
      if (bErrores) {
        alert(
          "Error en la asignacion de tareas al empleado, por favor compruebe el estado del servidor"
        );
      } else {
        alert("Tareas asignadas correctamente");
      }
    }
  }

  //DataFetch
  useEffect(() => {
    axios
      .get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/AsignarTareas`)
      .catch((e) => console.log(e))
      .then((response) => {
        try {
          var taRDGTareas = [];
          response.data.Tareas.forEach((i, n) => {
            taRDGTareas = [
              ...taRDGTareas,
              {
                id: n++,
                ID: i.ID,
                COD2: i.COD2,
                Codigo: i.Codigo,
                Descripcion: i.Descripcion[0], //Esta duplicado
                COD2Nombre: i.COD2Nombre,
                TiempoEstimado: i.TiempoEstimado,
                sEmpleadoApoyo: -1,
              },
            ];
          });
          SetaRDGTareas(taRDGTareas);
        } catch {
          alert("Error obteniendo los datos, compruebe el estado del servidor");
        }
        try {
          var _aOpsEmp = [];
          response.data.Empleados.forEach((i) => {
            _aOpsEmp = [
              ..._aOpsEmp,
              {
                value: i.Alias,
                label: `${i.Alias} | ${i.Apellidos} | ${i.Nombre}`,
              },
            ];
          });
          SetaOpcionesEmpleados(_aOpsEmp);
        } catch {
          alert("Error obteniendo datos");
        }
      });
  }, []);

  const colDGTareas = [
    { field: "ID", headerName: "ID", width: 150, hide: true },
    { field: "Codigo", headerName: "Codigo", width: 150 },
    { field: "COD2", headerName: "COD2", width: 70 },
    { field: "COD2Nombre", headerName: "COD2Nombre", width: 200 },
    { field: "TiempoEstimado", headerName: "T.Estimado (min)", width: 120 },
    { field: "Descripcion", headerName: "Descripcion", width: 500 },
  ];

  return (
    <Fragment>
      <div className='row m-4'>
        <DataGrid
          columns={colDGTareas}
          components={{ Toolbar: GridToolbar }}
          density='compact'
          rows={aRDGTareas}
          sx={{ width: "100%", height: "400px" }}
          rowsPerPageOptions={[10]}
          pageSize={20}
          checkboxSelection={true}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = aRDGTareas.filter((row) =>
              selectedIDs.has(row.id)
            );
            try {
              SetaTareasSeleccionadas(selectedRowData);
              //Calculamos el tiempo total
              var iMinutosTotales = 0;
              selectedRowData.forEach((i) => {
                iMinutosTotales += i.TiempoEstimado;
              });
              SetiTiempoTotal(iMinutosTotales);
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </div>
      <div id='TSel' className='row'>
        <div className='col-4 d-flex'>
          <h5 className='m-4'>Tiempo Total: {iTiempoTotal} minutos</h5>
        </div>
        <div className='col d-flex m-4 w-50 '>
          <div className='container d-flex '>
            <div className='col d-flex justify-content-end w-25'>
              <h5 className='mt-1' style={{ marginRight: "1%" }}>
                Asignar Empleado:{" "}
              </h5>
              <Select
                className='basic-single w-50'
                defaultValue={aOpcionesEmpleados[0]}
                options={aOpcionesEmpleados}
                onChange={(e) => {
                  SetsEmpleadoAsignadoID(e.value);
                }}
                isSearchable={true}
              />
            </div>
          </div>
        </div>
        <div className='col d-flex m-4'>
          <div className='container d-flex'>
            <p className='h5 mt-1'>F.Programada</p>
            <input
              className='ms-2'
              type='date'
              onChange={(e) => SetdtFProgramada(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='container d-flex ms-4'>
          <Button variant='contained' onClick={() => AssignTask()}>
            Asignar las Tareas
          </Button>
        </div>
      </div>
      <div className='row m-2 justify-content-center'>
        <table
          className='table m-4'
          hidden={aTareasSeleccionadas.length === 0}
          style={{ backgroundColor: "RGB(241, 248, 255)" }}
        >
          <thead>
            <th className='text-center border-bottom border-start border-end'>
              Orden
            </th>
            <th className='text-center border-bottom border-start border-end'>
              Codigo
            </th>
            <th className='text-center border-bottom border-start border-end'>
              COD2
            </th>
            <th className='text-center border-bottom border-start border-end'>
              COD2Nombre
            </th>
            <th className='text-center border-bottom border-start border-end'>
              Empleado De Apoyo
            </th>
          </thead>
          <tbody>
            {aTareasSeleccionadas.map((i, n) => {
              return (
                <Fragment>
                  <tr style={{ height: "10px" }}>
                    <td className='text-center border'>{n + 1}</td>
                    <td className='text-center border'>{i.Codigo}</td>
                    <td className='text-center border'>{i.COD2}</td>
                    <td className='text-center border'>{i.COD2Nombre}</td>
                    <td className='text-center border w-25'>
                      <Select
                        className='basic-single'
                        //defaultValue={aOpcionesEmpleados[0]}
                        options={aOpcionesEmpleados}
                        isSearchable={true}
                        onChange={(e) => {
                          SetaTareasSeleccionadas(
                            aTareasSeleccionadas.map((j) =>
                              j.ID === i.ID
                                ? { ...j, iEmpleadoApoyoID: e.value }
                                : j
                            )
                          );
                          console.log(i);
                        }}
                      />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}
