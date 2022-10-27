import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import { Container } from "react-bootstrap";

export default function RepuestosMaquina() {
  //Hooks
  const navigate = useNavigate();

  //UseStates
  const [aMaquina, SetaMaquina] = useState([]);
  const [SeleccionMaquina, SetSeleccionMaquina] = useState([]);
  //DataFetch
  useEffect(() => {
    axios
      .get(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina`
      )
      .catch((e) => console.log(e))
      .then((response) => {
        console.log(response.data.Maquinas);
        SetaMaquina(response.data.Maquinas);
      });
  }, []);

  //Rows/Cols para DataGrid
  const ColsMaquinas = [
    { field: "ID", headerName: "ID", width: 150, hide: true },
    { field: "Codigo", headerName: "Codigo", width: 150 },
    { field: "COD0", headerName: "COD0", width: 100 },
    { field: "COD1", headerName: "COD1", width: 100 },
    { field: "COD2", headerName: "COD2", width: 100 },
    { field: "Descripcion", headerName: "Descripcion", width: 500 },
  ];

  var RowsMaquinas = [];
  aMaquina.map((i) => {
    RowsMaquinas.push({
      id: Math.random(),
      ID: i.ID,
      Codigo: i.Codigo,
      COD0: i.COD0,
      COD1: i.COD1,
      COD2: i.COD2,
      Descripcion: i.Descripcion,
    });
  });
  return (
    <Fragment>
      <div id='Wrapperdiv' className='container'>
        <div className='row'>
          <div id='colDataGrid' className='col-8'>
            <DataGrid
              columns={ColsMaquinas}
              components={{ Toolbar: GridToolbar }}
              rows={RowsMaquinas}
              sx={{ width: "100%", height: "400px" }}
              rowsPerPageOptions={[10]}
              pageSize={20}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              onSelectionModelChange={(r) => {
                const selectedIDs = new Set(r);
                const selectedRowData = RowsMaquinas.filter((row) =>
                  selectedIDs.has(row.id)
                );
                SetSeleccionMaquina(selectedRowData);
              }}
            />
          </div>
          <div id='colCheckbox' className='col-4'></div>
        </div>
      </div>
    </Fragment>
  );
}
