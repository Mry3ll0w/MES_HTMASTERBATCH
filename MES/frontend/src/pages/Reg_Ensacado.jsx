//Visuals
import {
  TextField,
  Button,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { DataGrid, esES} from '@mui/x-data-grid';

//import { DataGrid,esEs} from "@mui/x-data-grid";
import React, { Fragment,useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';

export default function RegEnsacado({LoggedUser}) {

  const navigate = useNavigate();
  const nav_login = () =>{
    navigate('/Login')
  }
 
  //alert(`Nombre : ${sessionStorage.getItem('logged')}`)
  if(sessionStorage.getItem('logged') === null){
    alert('Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario');
    nav_login();
  }


  //Necesitamos UseState para tratar con los TextFields
  const [M_Fecha, mfecha] = useState("");
  const [M_Turno, mturno] = useState("");
  const [M_Producto, mprod] = useState("");
  const [M_Palet, mpalet] = useState("");
  const [M_Peso_Saco, mpsaco] = useState('-');
  const [M_Cantidad, mcant] = useState(0);
  const [M_Resto, mresto] = useState(0);
  const [M_Ant, mant] = useState(0);

  //Manejadores de errores
  const [Err_palet, err_palet] = useState(false);
  const [F_error, ferr] = useState(false);
  const [T_error, terror] = useState(false);
  const [Prod_error, prerror] = useState(false);
  
  const [Cant_Error, cerror] = useState(false);
  const [Resto_Error, rerror] = useState(false);
  const [Ant_Error, aerror] = useState(false);

  //Constantes para trabajar con los datos
  const [Productos, SetProductos] = useState([]);
  const [Ensacados, SetEnsacados] = useState([]);
  const [Selected, SetSelected] = useState([]);
  const [OldPalet, setOldPalet] = useState(""); //Sirve para guardar el estado anterior

  //Cambio de campos cuando presionamos intro
  const TurnoRef = useRef(null)
  const ProdRef = useRef(null)
  const PaletRef = useRef(null)
  const PesoSacoRef = useRef(null)
  const CantRef = useRef(null)
  const RestoRef = useRef(null)
  const AntRef = useRef(null)


  //Obtenemos el resultado del get
  useEffect(() => {
    axios
      .get("http://192.168.0.123:4001/RegEnsacado")
      .then((response) => {
        SetProductos(response.data.Productos);
        SetEnsacados(response.data.Ensacados);
      })
      .catch((error) => console.log(error));
  }, []);

  //Columnas
  const columns = [
    { field: "Fecha", headerName: "Fecha", width: "150" },
    { field: "Turno", headerName: "Turno", width: "90" },
    { field: "Producto", headerName: "Producto", width: "150" },
    { field: "Palet", headerName: "NºLote-NºPalet", width: "150" },
    { field: "Cantidad", headerName: "Cantidad(KG)", width: "120" },
    { field: "Resto", headerName: "Resto (KG)", width: "110" },
    { field: "Peso_Saco", headerName: "Peso Saco (KG)", width: "130" },
    { field: "Ant", headerName: "Anterior (KG)", width: "100" },
    { field: "Iniciales", headerName: "Imputado por", width: "100" }
  ];

  //Construimos las filas
  let rows = [];

  Ensacados.map((i, n) => {
    return (rows = [
      ...rows,
      {
        id: n++,
        Fecha: dateFormat(i.Fecha, "dd/mm/yyyy"),
        Turno: i.Turno,
        Producto: i.Producto,
        Palet: i.Palet,
        Cantidad: i.Cantidad,
        Resto: i.Resto,
        Peso_Saco: i.Peso_Saco,
        Ant: i.Ant,
        Iniciales : i.Iniciales
      },
    ]);
  });

  //Funciones para tratar los textFields

  //Comprueba los erorres de la posible modificacion y modifica el Ensacado seleccionado
  function UpdateEnsacado() {
    var ok = true;
    //Comprobamos que se cumplan los elementos dados
    if (M_Fecha === "") {
      ok = false;
      ferr(true);
      alert(
        "La Fecha no puede estar en blanco, o el formato de la fecha no es el correcto"
      );
    } else ferr(false);

    if (M_Turno === "") {
      ok = false;
      terror(true);
      alert("Selecciona un Turno de la lista inferior");
    } else terror(false);

    if (M_Producto === "") {
      ok = false;
      prerror(true);
      alert("Selecciona un Producto de la lista inferior");
    } else prerror(false);

    if (M_Palet === "" || M_Palet.length !== 14) {
      ok = false;
      err_palet(true);
      alert(
        "No dejes el palet en blanco o revisa el formato del mismo (xxxxxxxxxxx-xxxx) "
      );
    } else err_palet(false);

    
    if (isNaN(M_Cantidad) === true) {
      ok = false;
      cerror(true);
      alert("La Cantidad no puede ser un valor no numerico");
    } else cerror(false);

    if (isNaN(M_Resto) === true) {
      ok = false;
      rerror(true);
      alert("El Resto no puede ser no numerico");
    } else rerror(false);

    

    //Si todo esta correcto enviamos el post para que el backend trate la query
    if (ok) {
      axios
        .post("http://192.168.0.123:4001/UpdateEnsacado", {
          Fecha: dateFormat(M_Fecha,'yyyy-mm-dd'),
          Turno: M_Turno,
          Producto: M_Producto,
          Palet: M_Palet,
          Peso_Saco: M_Peso_Saco,
          Cantidad: M_Cantidad,
          Resto: M_Resto,
          Ant: M_Ant,
          PaletOriginal: OldPalet,
        })
        .then(() => {
          alert("Insercion realizada");
        })
        .catch((err) => {
          console.log(err);
        });
      window.location.reload(false);
    }
  }

  function InsertaEnsacado() {
    var ok = true;
    //Comprobamos que se cumplan los elementos dados
    if (M_Fecha === "") {
      ok = false;
      ferr(true);
      alert(
        "La Fecha no puede estar en blanco, o el formato de la fecha no es el correcto"
      );
    } else ferr(false);

    if (M_Turno === "") {
      ok = false;
      terror(true);
      alert("Selecciona un Turno de la lista inferior");
    } else terror(false);

    if (M_Producto === "") {
      ok = false;
      prerror(true);
      alert("Selecciona un Producto de la lista inferior");
    } else prerror(false);

    //Comprobamos que ademas de tener el palet con su forma este no exista
    if (M_Palet === "" || M_Palet.length !== 14) {
      ok = false;
      err_palet(true);
      alert(
        "No dejes el palet en blanco o revisa el formato del mismo (xxxxxxxxxxx-xxxx) "
      );
    } else err_palet(false);

    
    if (isNaN(M_Cantidad) === true) {
      ok = false;
      cerror(true);
      alert("La Cantidad no puede ser un valor no numerico");
    } else cerror(false);

    if (isNaN(M_Resto) === true) {
      ok = false;
      rerror(true);
      alert("El Resto no puede ser no numerico");
    } else rerror(false);

    if (isNaN(M_Resto) === true) {
      ok = false;
      rerror(true);
      alert("El Resto no puede ser no numerico");
    } else rerror(false);


    //Si todo esta correcto enviamos el post para que el backend trate la query
    if (ok) {
      console.log({
        Fecha: M_Fecha,
        Turno: M_Turno,
        Producto: M_Producto,
        Palet: M_Palet,
        Peso_Saco: M_Peso_Saco,
        Cantidad: M_Cantidad,
        Resto: M_Resto,
        Ant: M_Ant,
      })
      axios
        .post("http://192.168.0.123:4001/RegistraEnsacado", {
          Fecha: M_Fecha,
          Turno: M_Turno,
          Producto: M_Producto,
          Palet: M_Palet,
          Peso_Saco: M_Peso_Saco,
          Cantidad: M_Cantidad,
          Resto: M_Resto,
          Ant: M_Ant,
          iniciales : sessionStorage.getItem('iniciales')
        })
        .then(() => {
          alert("Insercion realizada");
        })
        .catch((err) => {
          console.log(err);
        });
      window.location.reload(false);
    }
  }

  //Borra el/los ensacados que son seleccionados en el menu
  function DeleteEnsacados() {
    var err;
    Selected.map((i) => {
      var[d,m,year]=i.Fecha.split('/');
      var ft=`${year}-${m}-${d}`
      axios
        .post("http://192.168.0.123:4001/DelEns", {
          Fecha: ft,
          Turno: i.Turno,
          Palet: i.Palet,
        })
        .catch((e) => {
          err = e;
        });
    });
    if (err) {
      alert("Fallo en la eliminacion");
    } else {
      alert("Eliminacion correcta");
      window.location.reload(false);
    }
  }
  //Probando workflows
  return (
    <Fragment>
      <h1>Bienvenido al panel de Inserción/Modificación de los ensacados.</h1>
      <p>
        Se muestran los ultimos ensacados, ordenados por fecha, en caso de querer modificar
        seleccione UN ÚNICO ensacado.<br></br>
        Si desea eliminar uno o varios seleccione todos aquellos que deseas cambiar, tras esto
        pulse el boton de eliminación.
      </p>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
          rows={rows}
          columns={columns}
          pageSize={100}
          checkboxSelection
          rowsPerPageOptions={[10]}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = rows.filter((row) =>
              selectedIDs.has(row.id)
            );
            console.log(selectedRowData);
            //Creacion Ensacado
            selectedRowData.map((i) => {
              var[d,m,year]=i.Fecha.split('/');
              var tDate = new Date(`${year}-${m}-${d}`);
              //console.log(i.Fecha)
              tDate = dateFormat(tDate, "yyyy-mm-dd");
              console.log(tDate);
              mfecha(tDate);
              mpalet(i.Palet);
              mpsaco(i.Peso_Saco);
              mcant(i.Cantidad);
              mresto(i.Resto);
              mant(i.Ant);
              setOldPalet(i.Palet);
              return 0;
            });
            SetSelected(selectedRowData);
          }}
        />
      </div>
      {
        <Box sx={{ p: 2, m: "3px", border: "1px dotted blue" }}>
          <Paper>
            <h2>Inserta el nuevo ensacado</h2>

            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                <MobileDatePicker
                    label="Fecha"
                    inputFormat="dd/MM/yyyy"
                    value={M_Fecha}
                    onChange={e => mfecha(e)}
                    renderInput={(params) => 
                      <TextField 
                        sx={{m:'3px', p :'3px'}} {...params} 
                        inputProps = {{
                            onKeyPress: event => {
                              const { key } = event;
                              console.log(key);
                              if (key === "Enter") {
                                TurnoRef.current.focus();
                              }
                            }
                          }}
                    />}
                    error={F_error}
                  />
            </LocalizationProvider>
            

            <FormControl>
              {/* Para darle formato mas limpio a los Select*/}
              <InputLabel>Turnos</InputLabel>
              <Select
                sx={{ width: "100", m: "3px", p: "3px", minWidth: 100 }}
                defaultValue=""
                label="Turno"
                onChange={(e) => mturno(e.target.value)}
                required
                inputRef={TurnoRef}
                error={T_error}
              >
                <MenuItem value={"Mañana"}>Mañana</MenuItem>
                <MenuItem value={"Tarde"}>Tarde</MenuItem>
                <MenuItem value={"Noche"}>Noche</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Autocomplete
                options={Productos}
                inputRef={ProdRef}
                inputProps = {{
                  onKeyPress: event => {
                    const { key } = event;
                    console.log(key);
                    if (key === "Enter") {
                      PaletRef.current.focus();
                    }
                  }
                }}
                getOptionLabel={(o) => o.ProductoID}
                renderInput={(e) => (
                  <TextField
                    {...e}
                    value={M_Producto}
                    onChange={(e) => mprod(e.target.value)}
                    sx={{ p: "3px", m: "3px", width: "250px"}}
                    label="Productos"
                    
                  ></TextField>
                )}
                onChange={(e, v) => mprod(v.ProductoID)}
                freeSolo
              />
            </FormControl>

            <TextField
              value={M_Palet}
              inputRef={PaletRef}
              inputProps = {{
                onKeyPress: event => {
                  const { key } = event;
                  console.log(key);
                  if (key === "Enter") {
                    PesoSacoRef.current.focus();
                  }
                }
              }}
              onChange={(e) => mpalet(e.target.value)}
              label="NºLote-NºPalet"
              sx={{ m: "3px", p: "3px" }}
              error={Err_palet}
            />
            <TextField
              value={M_Peso_Saco}
              onChange={(e) => mpsaco(e.target.value)}
              label="Peso Saco(kg)"
              sx={{ m: "3px", p: "3px" }}
              inputRef={PesoSacoRef}
              inputProps = {{
                onKeyPress: event => {
                  const { key } = event;
                  console.log(key);
                  if (key === "Enter") {
                    CantRef.current.focus();
                  }
                }
              }}
              
            />
            <p></p>
            <TextField
              value={M_Cantidad}
              onChange={(e) => mcant(e.target.value)}
              label="Cantidad (kg)"
              sx={{ m: "3px", p: "3px" }}
              error={Cant_Error}
              inputRef={CantRef}
              inputProps = {{
                onKeyPress: event => {
                  const { key } = event;
                  console.log(key);
                  if (key === "Enter") {
                    RestoRef.current.focus();
                  }
                }
              }}
            />

            <TextField
              value={M_Resto}
              onChange={(e) => mresto(e.target.value)}
              label="Resto (kg)"
              sx={{ m: "3px", p: "3px" }}
              error={Resto_Error}
              inputRef={RestoRef}
              inputProps = {{
                onKeyPress: event => {
                  const { key } = event;
                  console.log(key);
                  if (key === "Enter") {
                    AntRef.current.focus();
                  }
                }
              }}
            />

            

            <TextField
              value={M_Ant}
              onChange={(e) => mant(e.target.value)}
              label="Anterior (kg)"
              sx={{ m: "3px", p: "3px" }}
              error={Ant_Error}
              inputRef={AntRef}
            />

            <Button
              sx={{ m: "10px" }}
              onClick={InsertaEnsacado}
              variant="contained"
            >
              Inserta el Ensacado
            </Button>
            <Button
              sx={{ m: "10px" }}
              onClick={DeleteEnsacados}
              variant="contained"
            >
              Elimina el/los ensacado seleccionados
            </Button>
          </Paper>

          <Button
            sx={{ m: "10px" }}
            onClick={UpdateEnsacado}
            variant="contained"
          >
            Corrige/Modifica el Ensacado
          </Button>
          <p>
            *Nota : En caso de equivocación en la inserción del ensacado
            seleccione el erroneo en la lista anterior y corrijalo
          </p>
        </Box>
      }
    </Fragment>
  );
}
