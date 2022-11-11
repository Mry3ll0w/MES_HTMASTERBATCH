import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import { Autocomplete, TextField, Button } from "@mui/material";
import { Container } from "react-bootstrap";
import HorizontalCard from "./Components/HorizontalCard";
import "./css/RepuestosMaquina.css";
export default function RepuestosMaquina() {
  //Hooks
  const navigate = useNavigate();

  //UseStates
  const [aMaquina, SetaMaquina] = useState([]);
  const [aMateriales, SetaMateriales] = useState([]);
  const [aOpcionesMaquina, SetaOpcionesMaquina] = useState([]);
  const [SeleccionOpcionMaquina, SetSeleccionOpcionMaquina] = useState("");
  const [SeleccionOpcionCOD0, SetSeleccionOpcionCOD0] = useState("");
  const [SeleccionOpcionCOD1, SetSeleccionOpcionCOD1] = useState("");
  const [SeleccionOpcionCOD2, SetSeleccionOpcionCOD2] = useState("");
  const [aOpcionesCOD1, SetaOpcionesCOD1] = useState([]);
  const [aOpcionesCOD2, SetaOpcionesCOD2] = useState([]);
  const [sSelMaquina, SetsSelMaquina] = useState("");

  //Function
  function FetchMaquinas() {
    axios
      .get(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina`
      )
      .catch((e) => console.log(e))
      .then((response) => {
        console.log(response.data);
        //Procesamos la lista de Maquinas
        var _aops_maquinas = [];
        try {
          response.data.Maquinas.map((i) =>
            _aops_maquinas.push(`${i.Codigo}|${i.Descripcion}`)
          );
        } catch {
          console.log("Fallo procesando las opciones de las maquinas");
        }
        SetaOpcionesMaquina(_aops_maquinas);
        SetaMaquina(response.data.Maquinas);

        SetaOpcionesCOD1(response.data.ListaCOD1);
        SetaOpcionesCOD2(response.data.ListaCOD2);
      });
  }

  function FetchRepuestosMaquina(Codigo) {
    axios
      .post(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina`,
        { sCodigoMaquina: Codigo }
      )
      .catch((e) => console.log(e))
      .then((response) => {
        SetaMateriales(response.data.Materiales);
      });
  }

  //DataFetch

  useEffect(() => {
    FetchMaquinas();
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
              sx={{ width: "100%", height: "100%" }}
              rowsPerPageOptions={[10]}
              pageSize={20}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              onSelectionModelChange={(r) => {
                const selectedIDs = new Set(r);
                const selectedRowData = RowsMaquinas.filter((row) =>
                  selectedIDs.has(row.id)
                );
                console.log(selectedRowData[0]);
                if (selectedRowData.length > 0) {
                  SetaMateriales([]);
                  FetchRepuestosMaquina(selectedRowData[0].Codigo);
                  SetsSelMaquina(selectedRowData[0].Codigo);
                }
              }}
            />
          </div>
          <div id='colFilter' className='col-4'>
            <div className='row border rounded'>
              <br />
              <div className='row mt-2'>
                <h2>Filtrado de Máquinas</h2>
              </div>
              <br />
              <div className='row'>
                <div className='m-1'>
                  <Autocomplete
                    value={SeleccionOpcionMaquina}
                    //isOptionEqualToValue={(option, value) => option === value}
                    options={aOpcionesMaquina}
                    onChange={(e, v) => {
                      SetSeleccionOpcionMaquina(v);
                      const [csCodigo] = v.split("|");
                      SetaMaquina(
                        aMaquina.filter((i) => i.Codigo === csCodigo)
                      );
                    }}
                    renderInput={(e) => (
                      <TextField
                        {...e}
                        value={SeleccionOpcionMaquina}
                        label='Filtrado por Maquina'
                        sx={{
                          width: "100%",
                          m: "3px",
                          p: "3px",
                        }}
                      ></TextField>
                    )}
                  ></Autocomplete>
                </div>
              </div>

              <div className='row'>
                <div className='m-1'>
                  <Autocomplete
                    value={SeleccionOpcionCOD1}
                    //isOptionEqualToValue={(option, value) => option === value}
                    options={aOpcionesCOD1}
                    onChange={(e, v) => {
                      SetSeleccionOpcionCOD1(v);
                      if (v !== "") {
                        const [csCOD1] = v.split(" | ");
                        SetaMaquina(aMaquina.filter((i) => i.COD1 === csCOD1));
                      }
                    }}
                    renderInput={(e) => (
                      <TextField
                        {...e}
                        label='Filtrado COD1'
                        value={SeleccionOpcionCOD1}
                        sx={{
                          width: "100%",
                          m: "3px",
                          p: "3px",
                        }}
                      ></TextField>
                    )}
                  ></Autocomplete>
                </div>
              </div>
              <div className='row'>
                <div className='m-1'>
                  <Autocomplete
                    value={SeleccionOpcionCOD2}
                    //isOptionEqualToValue={(option, value) => option === value}
                    options={aOpcionesCOD2}
                    onChange={(e, v) => {
                      SetSeleccionOpcionCOD2(v);
                      if (v !== "") {
                        const [csCOD2] = v.split(" | ");
                        SetaMaquina(aMaquina.filter((i) => i.COD2 === csCOD2));
                      }
                    }}
                    renderInput={(e) => (
                      <TextField
                        {...e}
                        label='Filtrado COD2'
                        value={SeleccionOpcionCOD2}
                        sx={{
                          width: "100%",
                          m: "3px",
                          p: "3px",
                        }}
                      ></TextField>
                    )}
                  ></Autocomplete>
                </div>
              </div>
              <div className='row'>
                <Container className='d-flex justify-content-center mb-2'>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      SetSeleccionOpcionMaquina("");
                      SetSeleccionOpcionCOD0("");
                      SetSeleccionOpcionCOD1("");
                      SetSeleccionOpcionCOD2("");
                      FetchMaquinas();
                    }}
                  >
                    Limpiar Filtrado
                  </Button>
                  <br />
                </Container>
              </div>
            </div>
          </div>
        </div>
        <div className='row m-3'>
          <h2 className='d-flex justify-content-center mt-2 mb-4'>Repuestos</h2>
          {aMateriales.map((i) => {
            return (
              <HorizontalCard
                Reference={i.Referencia}
                Description={i.Descripcion}
                Stock={i.Stock}
                Location={i.Ubicacion}
              />
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
