import React, { useEffect, useState, Fragment } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
export default function AsignaTareas() {
  //UseStates
  var [aTareas, SetaTareas] = useState([]);
  var [aRDGTareas, SetaRDGTareas] = useState([]);
  var [aTareasSeleccionadas, SetaTareasSeleccionadas] = useState([]);
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
          response.data.Tareas.map((i) => {
            taRDGTareas = [
              ...taRDGTareas,
              {
                id: Math.random(),
                ID: i.ID,
                COD2: i.COD2,
                Codigo: i.Codigo,
                Descripcion: i.Descripcion[0], //Esta duplicado
                COD2Nombre: i.COD2Nombre,
                TiempoEstimado: i.TiempoEstimado,
              },
            ];
          });
          SetaRDGTareas(taRDGTareas);
        } catch {
          alert("Error obteniendo los datos, compruebe el estado del servidor");
        }
      });
  }, []);

  const colDGTareas = [
    { field: "ID", headerName: "ID", width: 150, hide: true },
    { field: "Codigo", headerName: "Codigo", width: 150 },
    { field: "COD2", headerName: "COD2", width: 100 },
    { field: "COD2Nombre", headerName: "COD2Nombre", width: 100 },
    { field: "TiempoEstimado", headerName: "Tiempo Estimado", width: 100 },
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
            const selectedRowData = aTareas.filter((row) =>
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
      <div id='Filtros' className='row justify-content-center'>
        <div className='col-6 ml-4'></div>
      </div>
    </Fragment>
  );
}
