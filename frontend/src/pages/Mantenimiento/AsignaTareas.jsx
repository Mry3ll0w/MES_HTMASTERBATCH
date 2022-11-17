import React, { useEffect, useState, Fragment } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
export default function AsignaTareas() {
  //UseStates
  var [aTareas, SetaTareas] = useState([]);
  var [aRDGTareas, SetaRDGTareas] = useState([]);
  var [aTareasSeleccionadas, SetaTareasSeleccionadas] = useState([]);
  var [tTiempoTotal, SettTiempoTotal] = useState("");
  //DataFetch
  useEffect(() => {
    axios
      .get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/AsignarTareas`)
      .catch((e) => console.log(e))
      .then((response) => {
        try {
          //console.log(response.data.Tareas);
          SetaTareas(response.data.Tareas);
          var taRDGTareas = [];
          response.data.Tareas.map((i, n) => {
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
                iIDEmpleadoApoyo: -1,
              },
            ];
          });
          SetaRDGTareas(taRDGTareas);
        } catch {
          alert("Error obteniendo los datos, compruebe el estado del servidor");
        }
      });
  }, []);

  //Funciones de apoyo
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60; //Resto de esa division es el tiempo en minutos que sobra
    return { hours, minutes };
  }

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
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </div>
      <div id='TSel' className='row justify-content-center'>
        <div className='col d-flex justify-content-center mt-3'>
          <p className='h2'>Tareas Seleccionadas:</p>
        </div>
      </div>
      <div className='row justify-content-center'>
        <table className='table'>
          <tbody>
            {aTareasSeleccionadas.map((i) => {
              return <p>Borrame</p>;
            })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}
