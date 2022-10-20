import React, { Fragment, useEffect } from "react";
import {
  Select as RSelect,
  Pagination,
  Autocomplete,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  MenuItem,
} from "@mui/material";
import "./Tareas.css";
import axios from "axios";
import { useState } from "react";
import { DateTime } from "luxon";
import { useNavigate } from "react-router-dom";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";
import AccionTarea from "./AccionTarea";
export default function MantenimientoTareas() {
  //Navigates
  const navigate = useNavigate();

  //useStates
  const [Codigo, SetCodigo] = useState("______");
  const [COD1Maquinas, SetCOD1Maquinas] = useState([]);
  const [SelMaquina, SetSelMaquina] = useState();
  const [MaquinasFiltradas, SetMaquinasFiltradas] = useState([]);
  const [SelCOD1, SetCOD1] = useState("Seleccioname");
  const [Descripcion, SetDescripcion] = useState("");
  const [Observacion, SetObservacion] = useState("Tarea creada en Planta:");
  const [NEquipoID, SetNEquipoID] = useState(0);
  const [NextID, SetNextID] = useState(0);
  const [CriticidadID, SetCriticidadID] = useState(1);
  const [CategoriaID, SetCategoriaID] = useState(3);
  const [EstadoTareaID, SetEstadoTareaID] = useState(1);
  //Acciones
  const [NAccionesAsociadas, SetNAccionesAsociadas] = useState(1);
  const [MAcciones, SetMAcciones] = useState([]);

  const [Empleados, SetEmpleados] = useState([]);
  const [OpEmpleados, SetOpcionesEmpleados] = useState([]);

  const [NFecha, SetNFecha] = useState("");
  const [EmpleadosAccion, SetEmpleadosAccion] = useState([]);

  //Consumo de materiales
  const [Materiales, SetMateriales] = useState([]);
  const [OpMat, SetOpMat] = useState([]);
  const [SelectedOptionsMat, SetSelectedOptionsMat] = useState([]);
  //Datos Tareas
  const [ListaTareas, SetListaTareas] = useState([]);

  //Seccion de Modificacion de ensacado
  const [IDSelectedRow, SetIDSelectedRow] = useState();
  const [MTarea, SetMTarea] = useState([]);
  const [MAccion, SetMAccion] = useState([]);
  const [MEmpleados, SetMEmpleados] = useState([]);
  const [MMateriales, SetMMateriales] = useState([]);
  const [MDescripcion, SetMDescripcion] = useState([]);
  const [MCodigo, SetMCodigo] = useState("-----");
  const [AgregaAcciones, SetAgregaAcciones] = useState(1);

  //DataFetch y carga inicial de useStates

  useEffect(() => {
    if (sessionStorage.getItem("iniciales") === null) {
      navigate("/login");
    }

    axios
      .get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas`)
      .catch((e) => console.log(e))
      .then((response) => {
        //Preparamos las maquinas para el select
        var tCOD1 = [];
        var Empleados = [];
        response.data.Maquinas.map((i, n) => {
          tCOD1 = [...tCOD1, i.COD1NOMBRE];
        });
        SetCOD1Maquinas(tCOD1);
        SetNextID(response.data.NextID.NextID);

        //Preparamos las opciones de empleado
        response.data.Empleados.map((i) => {
          Empleados = [
            ...Empleados,
            {
              value: i.ID,
              label: `${i.Codigo} | ${i.Alias} | ${i.Nombre} | ${i.Apellidos}`,
            },
          ];
        });
        SetOpcionesEmpleados(Empleados);
        SetEmpleados(response.data.Empleados);

        //Preparamos las opciones de materiales
        var tOpM = [];
        SetMateriales(response.data.Materiales);
        response.data.Materiales.map((i) => {
          tOpM = [
            ...tOpM,
            { value: i.ID, label: `${i.ID} | ${i.Descripcion}` },
          ];
        });
        SetOpMat(tOpM);
      });

    //Metemos la fecha actual
    const Actual = DateTime.now().c;
    SetNFecha(`${Actual.year}-${Actual.month}-${Actual.day}`);
  }, []);

  function fetchSelectedAction(ID) {
    axios
      .post(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tarea`, {
        ID: ID,
      })
      .catch((e) => console.log(e))
      .then((response) => {
        console.log(response.data);
        SetSelectedOptionsMat(response.data.MaterialesAccion);
        SetEmpleadosAccion(response.data.Empleados);
        try {
          var [f] = response.data.Tarea.FechaHora.split("T");
          SetNFecha(f);
        } catch {
          SetNFecha(new Date.toISOString().slice(0, 10));
        }
        SetMAcciones(response.data.Accion);
        SetMTarea(response.data.Tarea);
        SetMAccion(response.data.Accion);
        SetMEmpleados(response.data.Empleados);
        SetMMateriales(response.data.MaterialesAccion);
        SetMDescripcion(response.data.Tarea.Descripcion);
        SetMCodigo(response.data.Tarea.Codigo);
      });
  }

  //Internal functions

  //CRUD TAREAS

  function Update_Tarea_Completa() {}
  function DeleteTarea() {
    alert("Tarea Eliminada");
    axios
      .post(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas/DelTarea`,
        {
          TareaID: MTarea.ID,
        }
      )
      .catch((e) => {
        console.log(e);
      });
    window.location.reload(false);
  }
  //-------------------------------------------------------------- FUNCIONES TAREAS --------------------------------------
  function FetchTareas() {
    axios
      .get(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/ListaTareas`)
      .catch((e) => console.log(e))
      .then((response) => {
        console.log(response.data);
        SetListaTareas(response.data.ListaTareas);
      });
    //console.log(RowsListaTareas);
  }
  const ColsTareas = [
    { field: "ID", headerName: "ID", width: 150, hide: true },
    { field: "Codigo", headerName: "Codigo", width: 150 },
    { field: "Descripcion", headerName: "Descripcion", width: 600 },
  ];

  var RowsListaTareas = [];
  try {
    ListaTareas.map((i) => {
      RowsListaTareas = [
        ...RowsListaTareas,
        {
          id: i.ID,
          ID: i.ID,
          Codigo: i.Codigo,
          Descripcion: i.Descripcion,
        },
      ];
    });
  } catch {
    console.log("Error en la obtencion de la lista de tareas");
  }

  /**
   * Devuelve true si los campos necesarios para rellenar la tarea han sido llenados satisfactoriamente,
   * en cualquier otro caso devuelve false
   */
  function CamposCorrectos() {
    var ok = true;

    if (SelCOD1 === "Seleccioname") {
      ok = false;
      alert("Selecciona el COD1 de la maquina");
    }

    if (SelMaquina === null) {
      ok = false;
      alert("No dejes el equipo sin seleccionar");
    }

    return ok;
  }

  /**
   * Funcion para enviar los elementos al back
   */
  function SendTarea() {
    if (CamposCorrectos()) {
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/CreateTarea`,
          {
            NAcciones: NAccionesAsociadas,
            DatosTarea: {
              ID: NextID,
              Codigo: Codigo,
              CriticidadID: CriticidadID,
              Descripcion: Descripcion,
              Observaciones: Observacion,
              CategoriaID: CategoriaID,
              EstadoTareaID: EstadoTareaID,
              EquipoID: NEquipoID,
              FechaHora: NFecha,
              Abreviatura: sessionStorage.getItem("iniciales"),
            },
          }
        )
        .catch((e) => console.log(e));
      FetchTareas();
      alert("Tarea Insertada");
      //window.location.reload(false);
    }
  }

  // CRUD de Acciones

  function AddAccion(TAREAID) {
    //Si el ID no esta vacio
    if (TAREAID !== undefined && TAREAID !== null) {
      var i = 0;
      while (i < AgregaAcciones) {
        axios.post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/NewAccion`,
          {
            TAREAID: TAREAID,
            FechaHora: NFecha,
          }
        );
        ++i;
      }
      alert("Acciones añadidas");
      fetchSelectedAction(IDSelectedRow);
    } else {
      alert("Selecciona una tarea de la lista");
    }
  }

  function Erase_Accion(ID) {
    if (ID !== null && ID !== undefined) {
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/DelAccion`,
          {
            AccionID: ID,
          }
        )
        .catch((e) => console.table(e));

      alert("Tarea eliminada");
      fetchSelectedAction(IDSelectedRow);
    } else {
      alert("Selecciona una tarea de la lista");
    }
  }

  function Update_Accion(Accion) {
    if (Accion !== undefined && Accion !== null) {
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/UpdateAccion`,
          {
            Accion: Accion,
          }
        )
        .catch((e) => console.table(e));
      fetchSelectedAction();
    }
  }

  // CRUD Empleados Accion
  function UpdateEmpleados() {}

  return (
    <Fragment>
      <div className='AccordionDiv'>
        <br />
        <Accordion sx={{ margin: "1%" }}>
          <AccordionSummary sx={{ border: "1px solid black" }}>
            <Typography fontSize={"20px"} sx={{ textAlign: "center" }}>
              Creacion de nuevo Seguimiento/Tarea
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className='FormNewTarea'>
              <br />
              <table>
                <tbody>
                  <tr>
                    <th className='customTh'>
                      <Typography fontSize={"16px"}>
                        Criticidad de Tarea
                      </Typography>
                    </th>
                    <th className='customTh'>
                      <Typography fontSize={"16px"}>
                        Categoría De Tarea
                      </Typography>
                    </th>
                    <th className='customTh'>
                      <Typography fontSize={"16px"}>
                        Estado De La Tarea
                      </Typography>
                    </th>
                    <th className='customTh'>
                      <Typography fontSize={"16px"}> Creado:</Typography>
                    </th>
                  </tr>
                  <tr>
                    <td>
                      <RSelect
                        value={CriticidadID}
                        onChange={(e) => {
                          SetCriticidadID(e.target.value);
                        }}
                        sx={{ width: "165px" }}
                      >
                        <MenuItem value={1}>Sin definir</MenuItem>
                        <MenuItem value={2}>Alta</MenuItem>
                        <MenuItem value={3}>Media</MenuItem>
                        <MenuItem value={4}>Baja</MenuItem>
                      </RSelect>
                    </td>
                    <td>
                      <RSelect
                        value={CategoriaID}
                        onChange={(e) => {
                          SetCategoriaID(e.target.value);
                        }}
                        sx={{ width: "165px" }}
                      >
                        <MenuItem value={1}>Producción</MenuItem>
                        <MenuItem value={2}>Auxiliar</MenuItem>
                        <MenuItem value={3}>Mantenimiento</MenuItem>
                      </RSelect>
                    </td>
                    <td>
                      <RSelect
                        value={EstadoTareaID}
                        onChange={(e) => {
                          SetEstadoTareaID(e.target.value);
                        }}
                        sx={{ width: "165px" }}
                      >
                        <MenuItem
                          value={1}
                          sx={{ background: "#FF5252", textAlign: "center" }}
                        >
                          <Typography
                            sx={{ background: "#FF5252", textAlign: "center" }}
                          >
                            Pendiente
                          </Typography>
                        </MenuItem>
                        <MenuItem
                          value={2}
                          sx={{ background: "#7FCC72", textAlign: "center" }}
                        >
                          <Typography
                            sx={{ background: "#7FCC72", textAlign: "center" }}
                          >
                            Realizada
                          </Typography>
                        </MenuItem>
                      </RSelect>
                    </td>
                    <td>
                      <input
                        className='inputFecha'
                        type={"date"}
                        value={NFecha}
                        onChange={(e) => SetNFecha(e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
              <Typography fontSize={"16px"} sx={{ marginLeft: "10px" }}>
                Selecciona la maquina
              </Typography>
              <table>
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>
                      <Autocomplete
                        value={SelCOD1}
                        //isOptionEqualToValue={(option, value) => option === value}
                        options={COD1Maquinas}
                        onChange={(e, v) => {
                          SetCOD1(v);
                          SetSelMaquina(null);
                          SetCodigo("_____");
                          if (v !== null) {
                            axios
                              .post(
                                `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas`,
                                { COD1: v }
                              )
                              .catch((error) => console.log(error))
                              .then((reply) => {
                                try {
                                  var StrMaquinas = [];
                                  reply.data.FilteredMaquina.map((i) => {
                                    StrMaquinas = [
                                      ...StrMaquinas,
                                      `${i.Código} | ${i.COD2Nombre} | ${i.COD2} | ${i.MaquinaID}`,
                                    ];
                                  });
                                  SetMaquinasFiltradas(StrMaquinas);
                                } catch {
                                  console.log("Error en datos recibidos");
                                }
                              });
                          }
                        }}
                        renderInput={(e) => (
                          <TextField
                            {...e}
                            value={COD1Maquinas}
                            sx={{
                              width: "120px",
                              m: "3px",
                              p: "3px",
                              minWidth: 200,
                            }}
                          ></TextField>
                        )}
                      ></Autocomplete>
                    </td>
                    <td>
                      <Autocomplete
                        value={SelMaquina}
                        key={SelMaquina === null}
                        //isOptionEqualToValue={(option, value) => option === value}
                        options={MaquinasFiltradas}
                        onChange={(e, v) => {
                          //Comprobamos que formato tiene el codigo
                          var [code, , , eqID] = v.split(" | ");
                          //Generado el codigo usando el formato de planta
                          SetCodigo(`TP${code}-${NextID}`);
                          SetSelMaquina(v);
                          //Guardamos el EquipoID
                          SetNEquipoID(eqID);
                        }}
                        renderInput={(e) => (
                          <TextField
                            {...e}
                            value={SelMaquina}
                            sx={{
                              width: "390px",
                              m: "3px",
                              p: "3px",
                              minWidth: 200,
                            }}
                          ></TextField>
                        )}
                      ></Autocomplete>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Typography fontSize={"16px"} sx={{ marginLeft: "10px" }}>
                Descripción:
              </Typography>
              <br />
              <textarea
                className='Descripcion'
                value={Descripcion}
                onChange={(e) => SetDescripcion(e.target.value)}
              ></textarea>
              <br />
              <Typography fontSize={"16px"} sx={{ marginLeft: "10px" }}>
                Observacion:
              </Typography>
              <br />
              <textarea
                className='Observacion'
                value={Observacion}
                onChange={(e) => SetObservacion(e.target.value)}
              ></textarea>
              <br />

              <br />
            </div>

            <div>
              <Typography fontSize={"16px"} margin={"10px"}>
                Numero Acciones Asociadas :{" "}
                <input
                  type={"number"}
                  value={NAccionesAsociadas}
                  onChange={(e) => SetNAccionesAsociadas(e.target.value)}
                  style={{ textAlign: "center", width: "100px" }}
                />
              </Typography>
              <Button variant='contained' onClick={() => SendTarea()}>
                Crear Tarea con Codigo : {Codigo}
              </Button>

              <Typography fontSize={"13px"} sx={{ marginTop: "10px" }}>
                *Nota : La tarea será rellenada en la sección inferior de
                modificar tareas y acciones
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
        <Accordion sx={{ margin: "1%" }}>
          <AccordionSummary
            sx={{ border: "1px solid black" }}
            onClick={() => FetchTareas()}
          >
            <Typography fontSize={"20px"} sx={{ textAlign: "center" }}>
              Modificación de Seguimientos/Tareas/Acciones
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <br />
            <div className='SelectorTareas'>
              <br />
              <Accordion>
                <AccordionSummary sx={{ border: "1px solid black" }}>
                  <Typography fontSize={25} textAlign={"center"}>
                    Selecciona la tarea a Modificar
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ textAlign: "center" }}>
                  <DataGrid
                    columns={ColsTareas}
                    components={{ Toolbar: GridToolbar }}
                    rows={RowsListaTareas}
                    sx={{ width: "700px", height: "400px", marginLeft: "25%" }}
                    rowsPerPageOptions={[10]}
                    pageSize={20}
                    localeText={
                      esES.components.MuiDataGrid.defaultProps.localeText
                    }
                    onSelectionModelChange={(r) => {
                      const selectedIDs = new Set(r);
                      const selectedRowData = RowsListaTareas.filter((row) =>
                        selectedIDs.has(row.id)
                      );
                      SetIDSelectedRow(selectedRowData[0].ID);
                      fetchSelectedAction(selectedRowData[0].ID);
                    }}
                  />
                </AccordionDetails>
              </Accordion>
              <br />
              <div className='FormNewTarea'>
                <br />
                <table>
                  <tbody>
                    <tr>
                      <th className='customTh'>
                        <Typography fontSize={"16px"}>
                          Criticidad de Tarea
                        </Typography>
                      </th>
                      <th className='customTh'>
                        <Typography fontSize={"16px"}>
                          Categoría De Tarea
                        </Typography>
                      </th>
                      <th className='customTh'>
                        <Typography fontSize={"16px"}>
                          Estado De La Tarea
                        </Typography>
                      </th>
                      <th className='customTh'>
                        <Typography fontSize={"16px"}> Creado:</Typography>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <RSelect
                          value={CriticidadID}
                          onChange={(e) => {
                            SetCriticidadID(e.target.value);
                          }}
                          sx={{ width: "165px" }}
                        >
                          <MenuItem value={1}>Sin definir</MenuItem>
                          <MenuItem value={2}>Alta</MenuItem>
                          <MenuItem value={3}>Media</MenuItem>
                          <MenuItem value={4}>Baja</MenuItem>
                        </RSelect>
                      </td>
                      <td>
                        <RSelect
                          value={CategoriaID}
                          onChange={(e) => {
                            SetCategoriaID(e.target.value);
                          }}
                          sx={{ width: "165px" }}
                        >
                          <MenuItem value={1}>Producción</MenuItem>
                          <MenuItem value={2}>Auxiliar</MenuItem>
                          <MenuItem value={3}>Mantenimiento</MenuItem>
                        </RSelect>
                      </td>
                      <td>
                        <RSelect
                          value={EstadoTareaID}
                          onChange={(e) => {
                            SetEstadoTareaID(e.target.value);
                          }}
                          sx={{ width: "165px" }}
                        >
                          <MenuItem
                            value={1}
                            sx={{ background: "#FF5252", textAlign: "center" }}
                          >
                            <Typography
                              sx={{
                                background: "#FF5252",
                                textAlign: "center",
                              }}
                            >
                              Pendiente
                            </Typography>
                          </MenuItem>
                          <MenuItem
                            value={2}
                            sx={{ background: "#7FCC72", textAlign: "center" }}
                          >
                            <Typography
                              sx={{
                                background: "#7FCC72",
                                textAlign: "center",
                              }}
                            >
                              Realizada
                            </Typography>
                          </MenuItem>
                        </RSelect>
                      </td>
                      <td>
                        <input
                          className='inputFecha'
                          type={"date"}
                          value={NFecha}
                          onChange={(e) => SetNFecha(e.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />
                <Typography fontSize={"16px"} sx={{ marginLeft: "10px" }}>
                  Selecciona la maquina
                </Typography>
                <table>
                  <tbody>
                    <tr></tr>
                    <tr>
                      <td>
                        <Autocomplete
                          value={SelCOD1}
                          //isOptionEqualToValue={(option, value) => option === value}
                          options={COD1Maquinas}
                          onChange={(e, v) => {
                            SetCOD1(v);
                            SetSelMaquina(null);
                            SetCodigo("_____");
                            if (v !== null) {
                              axios
                                .post(
                                  `http://${process.env.REACT_APP_SERVER}/Mantenimiento/Tareas`,
                                  { COD1: v }
                                )
                                .catch((error) => console.log(error))
                                .then((reply) => {
                                  try {
                                    var StrMaquinas = [];
                                    reply.data.FilteredMaquina.map((i) => {
                                      StrMaquinas = [
                                        ...StrMaquinas,
                                        `${i.Código} | ${i.COD2Nombre} | ${i.COD2} | ${i.MaquinaID}`,
                                      ];
                                    });
                                    SetMaquinasFiltradas(StrMaquinas);
                                  } catch {
                                    console.log("Error en datos recibidos");
                                  }
                                });
                            }
                          }}
                          renderInput={(e) => (
                            <TextField
                              {...e}
                              value={COD1Maquinas}
                              sx={{
                                width: "120px",
                                m: "3px",
                                p: "3px",
                                minWidth: 200,
                              }}
                            ></TextField>
                          )}
                        ></Autocomplete>
                      </td>
                      <td>
                        <Autocomplete
                          value={SelMaquina}
                          key={SelMaquina === null}
                          //isOptionEqualToValue={(option, value) => option === value}
                          options={MaquinasFiltradas}
                          onChange={(e, v) => {
                            //Comprobamos que formato tiene el codigo
                            var [code, , , eqID] = v.split(" | ");
                            //Generado el codigo usando el formato de planta
                            SetMCodigo(`TP${code}-${NextID}`);
                            SetSelMaquina(v);
                            //Guardamos el EquipoID
                            SetNEquipoID(eqID);
                          }}
                          renderInput={(e) => (
                            <TextField
                              {...e}
                              value={SelMaquina}
                              sx={{
                                width: "390px",
                                m: "3px",
                                p: "3px",
                                minWidth: 200,
                              }}
                            ></TextField>
                          )}
                        ></Autocomplete>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Typography fontSize={"16px"} sx={{ marginLeft: "10px" }}>
                  Descripción:
                </Typography>
                <br />
                <textarea
                  className='Descripcion'
                  value={MTarea.Descripcion}
                  onChange={(e) => SetMDescripcion(e.target.value)}
                ></textarea>
                <br />
                <Typography fontSize={"16px"} sx={{ marginLeft: "10px" }}>
                  Observacion:
                </Typography>
                <br />
                <textarea
                  className='Observacion'
                  value={Observacion}
                  onChange={(e) => SetObservacion(e.target.value)}
                ></textarea>

                <Button
                  variant='contained'
                  sx={{ margin: "10px" }}
                  onClick={() => Update_Tarea_Completa()}
                >
                  Actualiza la tarea (Codigo Generado: {MCodigo})
                </Button>
                <br />
                <Button
                  sx={{ margin: "10px" }}
                  variant='contained'
                  onClick={() => DeleteTarea()}
                >
                  Eliminar Tarea Seleccionada
                </Button>
                <br />
              </div>
              <div className='OverflowDiv' style={{ overflowY: "auto" }}>
                <br />
                <div className='AgregaAcciones'>
                  <Typography fontSize={"18px"}>
                    Agregar Acciones :{" "}
                    <input
                      type={"number"}
                      min='1'
                      style={{ width: "100px" }}
                      value={AgregaAcciones}
                      onChange={(e) => SetAgregaAcciones(e.target.value)}
                    />
                    <Button
                      variant='contained'
                      size='small'
                      sx={{ marginLeft: "10px" }}
                      onClick={() => AddAccion(MTarea.ID)}
                    >
                      Agregar Acciones
                    </Button>
                  </Typography>
                </div>
                {MAcciones.map((i) => {
                  return (
                    <div className='OverflowDiv'>
                      <div className='TituloAcciones'>
                        <Typography fontSize={"25px"}>Acciones</Typography>
                      </div>
                      <div className=''>
                        <textarea
                          className='DescripcionEmpleado'
                          value={i.Accion}
                          onChange={(e) => {
                            SetMAcciones(
                              MAcciones.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, Accion: e.target.value }
                                  : j
                              )
                            );
                          }}
                        />
                        <br />
                        <Typography fontSize={"16px"}>
                          Observaciones del Empleado:
                        </Typography>
                        <textarea
                          className='ObservacionEmpleado'
                          value={i.Notas}
                          onChange={(e) => {
                            SetMAcciones(
                              MAcciones.map((j) =>
                                j.ID === i.ID
                                  ? { ...j, Notas: e.target.value }
                                  : j
                              )
                            );
                          }}
                        />
                        <div>
                          <br />
                          <Button
                            variant='contained'
                            sx={{ marginRight: "5px" }}
                            size='small'
                            onClick={() => Erase_Accion(i.ID)}
                          >
                            Eliminar Acción
                          </Button>

                          <Button
                            variant='contained'
                            sx={{ marginRight: "5px" }}
                            size='small'
                            onClick={() => Update_Accion(i)}
                          >
                            Actualizar Acción
                          </Button>
                          <br />

                          <AccionTarea
                            OpEmpleados={OpEmpleados}
                            Materiales={Materiales}
                            OpMat={OpMat}
                            Empleados={Empleados}
                            AccionID={i.ID}
                            FechaCreacion={NFecha}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        <br />
      </div>
    </Fragment>
  );
}
