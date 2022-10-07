//Visuals
import {
  TextField,
  Button,
  Paper,
  Box,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { DataGrid,GridToolbar, esES} from '@mui/x-data-grid';
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
  const [ObsError, SetObsError] = useState(false)
  const [EstadoBotonEliminar,SetEstadoBotonEliminar] = useState('visible')
  const [M_Fecha, mfecha] = useState("");
  const [M_Turno, mturno] = useState("");
  const [M_Producto, mprod] = useState("");
  const [M_Palet, mpalet] = useState("");
  const [M_Peso_Saco, mpsaco] = useState('-');
  const [M_Cantidad, mcant] = useState(0);
  const [M_Resto, mresto] = useState(0);
  const [M_Ant, mant] = useState(0);
  const [M_Observaciones, mObser] = useState("-");
  const [M_ID, mID] = useState(0)
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
  
  const [OldPalet, setOldPalet] = useState(""); //Sirve para guardar el estado anterior
  
  //Cambio de campos cuando presionamos intro
  
  const ProdRef = useRef(null)
  const PaletRef = useRef(null)
  const PesoSacoRef = useRef(null)
  const CantRef = useRef(null)
  const RestoRef = useRef(null)
  const AntRef = useRef(null)

  const [ArrProd, setArrProd] = useState([])

  //Obtenemos el resultado del get
  useEffect(() => {
    if(!sessionStorage.getItem('Formulario').includes('Produccion')){
      SetEstadoBotonEliminar('hidden')
    }
    var temp = []
    axios
      .get(`http://${process.env.REACT_APP_SERVER}/RegEnsacado`)
      .then((response) => {
        SetProductos(response.data.Productos);
        console.log(response.data)
        SetEnsacados(response.data.Ensacados);
        response.data.Productos.map(i => {
          return temp =[...temp, i.ProductoID]
        })
        temp = [...temp,'PRUEBA']
        setArrProd(temp)
      })
      .catch((error) => console.log(error));
      
  }, []);
  function UpdateData(){
    var temp = [];
    axios
      .get(`http://${process.env.REACT_APP_SERVER}/RegEnsacado`)
      .then((response) => {
        SetProductos(response.data.Productos);
        console.log(response.data)
        SetEnsacados(response.data.Ensacados);
        response.data.Productos.map(i => {
          return temp =[...temp, i.ProductoID]
        })
        temp = [...temp,'PRUEBA']
        setArrProd(temp)
      })
      .catch((error) => console.log(error));
  }
  //Columnas
  const columns = [
    { field: "Fecha", headerName: "Fecha", width: "150" },
    { field: "Turno", headerName: "Turno", width: "90" },
    { field: "Producto", headerName: "Producto", width: "150" },
    { field: "Palet", headerName: "NºLote-NºPalet", width: "150" },
    { field: "Peso_Saco", headerName: "Peso Saco (KG)", width: "130" },
    { field: "Cantidad", headerName: "Cantidad(KG)", width: "120" },
    { field: "Resto", headerName: "Resto (KG)", width: "110" },
    { field: "Ant", headerName: "Anterior (KG)", width: "100" },
    { field: "Iniciales", headerName: "Imputado por", width: "100" },
    { field: "Observaciones", headerName: "Observaciones", width : "500" },
    { field: "ID", headerName : "ID", width : "30", hide: true }
  ];

  //Construimos las filas
  let rows = [];
  try{
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
          Iniciales: i.Iniciales,
          Observaciones: i.Observaciones,
          ID: i.ID,
        },
      ]);
    });
  }
  catch{
    console.log('No se ha guardado correctamente los datos de ensacado')
  }
  
  
  
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
      alert("La Cantidad no puede ser un valor no numerico, si es un número decimal usa . en vez de ,");
    } else cerror(false);

    if (isNaN(M_Resto) === true) {
      ok = false;
      rerror(true);
      alert(
        "El Resto no puede ser no numerico , si es un número decimal usa . en vez de ,"
      );
    } else rerror(false);

    if (M_Observaciones === '') {
      ok = false;
      SetObsError(true);
      alert(
        "El campo de observacion no puede estar vacio, ponga - si quiere estar vacio."
      );
    } else SetObsError(false);

    //Si todo esta correcto enviamos el post para que el backend trate la query
    if (ok) {
      console.log("ENTRO OK");
      axios
        .post(`http://${process.env.REACT_APP_SERVER}/UpdateEnsacado`, {
          Fecha: dateFormat(M_Fecha,'yyyy-mm-dd'),
          Turno: M_Turno,
          Producto: M_Producto,
          Palet: M_Palet,
          Peso_Saco: M_Peso_Saco,
          Cantidad: M_Cantidad,
          Resto: M_Resto,
          Ant: M_Ant,
          PaletOriginal: OldPalet,
          Observaciones : M_Observaciones,
          ID : M_ID
        })
        .then(() => {
          alert("Insercion realizada");
        })
        .catch((err) => {
          console.log(err);
        });
        UpdateData()
      //window.location.reload(false);
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
      alert("La Cantidad no puede ser un valor no numerico ni tener comas, si es un decimal usa . en vez de ,");
    } else cerror(false);

    if (isNaN(M_Resto) === true) {
      ok = false;
      rerror(true);
      alert(
        "El Resto no puede ser no numerico, si es un decimal usa . en vez de ,"
      );
    } else rerror(false);

    if (isNaN(M_Resto) === true) {
      ok = false;
      rerror(true);
      alert(
        "El Resto no puede ser no numerico, si es un decimal usa . en vez de ,"
      );
    } else rerror(false);
    
    if (M_Observaciones === '') {
      ok = false;
      SetObsError(true);
      alert(
        "El campo de observacion no puede estar vacio, ponga - si quiere estar vacio."
      );
    } else SetObsError(false);
    
    //Si todo esta correcto enviamos el post para que el backend trate la query
    if (ok) {
      console.log('ENTRO OK')
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
        .post(`http://${process.env.REACT_APP_SERVER}/RegistraEnsacado`, {
          Fecha: M_Fecha,
          Turno: M_Turno,
          Producto: M_Producto,
          Palet: M_Palet,
          Peso_Saco: M_Peso_Saco === null  ? 0 : M_Peso_Saco,
          Cantidad: M_Cantidad === null  ? 0 : M_Cantidad,
          Resto: M_Resto === null ? 0 : M_Resto,
          Ant: M_Ant === null ? 0 : M_Ant,
          iniciales : sessionStorage.getItem('iniciales'),
          Observaciones : M_Observaciones
        })
        .then(() => {
          alert("Insercion realizada");
        })
        .catch((err) => {
          console.log(err);
        });
     UpdateData();
    }
  }

  //Borra el/los ensacados que son seleccionados en el menu
  function DeleteEnsacados() {
    var err;
    console.log(M_Fecha)
    axios
      .post(`http://${process.env.REACT_APP_SERVER}/DelEns`, {
        Fecha: M_Fecha,
        Turno: M_Turno,
        Palet: M_Palet,
        ID : M_ID
      })
      .catch((e) => {
        err = e;
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
        Se muestran los ultimos ensacados, ordenados por fecha, en caso de
        querer modificar seleccione UN ÚNICO ensacado.<br></br>
        Si desea eliminar uno o varios seleccione todos aquellos que deseas
        cambiar, tras esto pulse el boton de eliminación.
      </p>
      <div style={{ height: 700, width: "100%" }}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={rows}
          columns={columns}
          pageSize={20}
          components={{ Toolbar: GridToolbar }}
          //checkboxSelection
          rowsPerPageOptions={[10]}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = rows.filter((row) =>
              selectedIDs.has(row.id)
            );
            console.log(selectedRowData);
            //Creacion Ensacado
            selectedRowData.map((i) => {
              var [d, m, year] = i.Fecha.split("/");
              var tDate = new Date(`${year}-${m}-${d}`);
              //console.log(i.Fecha)
              tDate = dateFormat(tDate, "yyyy-mm-dd");
              mfecha(tDate);
              mpalet(i.Palet);
              mpsaco(i.Peso_Saco);
              mcant(i.Cantidad);
              mresto(i.Resto);
              mant(i.Ant);
              setOldPalet(i.Palet);
              mturno(i.Turno);
              mprod(i.Producto);
              mObser(i.Observaciones);
              mID(i.ID);
              return 0;
            });
          }}
        />
      </div>
      {
        <Box sx={{ p: 2, m: "3px", border: "1px dotted blue" }}>
          <Paper>
            <h2>Inserta el nuevo ensacado</h2>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
              <MobileDatePicker
                label="Fecha"
                inputFormat="dd/MM/yyyy"
                value={M_Fecha}
                onChange={(e) => mfecha(e)}
                renderInput={(params) => (
                  <TextField sx={{ m: "3px", p: "3px" }} {...params} />
                )}
                error={F_error}
              />
            </LocalizationProvider>

            <FormControl>
              <Autocomplete
                value={M_Turno}
                isOptionEqualToValue={(option, value) => option === value}
                options={["Mañana", "Tarde", "Noche"]}
                renderInput={(e) => (
                  <TextField
                    {...e}
                    value={M_Turno}
                    onChange={(e) => mturno(e.target.value)}
                    sx={{ width: "100", m: "3px", p: "3px", minWidth: 200 }}
                    label="Turno"
                  ></TextField>
                )}
                onChange={(e, v) => mturno(v)}
              />
            </FormControl>

            <FormControl>
              <Autocomplete
                value={M_Producto}
                isOptionEqualToValue={(option, value) => option === value}
                options={ArrProd}
                renderInput={(e) => (
                  <TextField
                    {...e}
                    value={M_Producto}
                    onChange={(e) => mprod(e.target.value)}
                    sx={{ p: "3px", m: "3px", marginLeft: 2, width: "250px" }}
                    label="Productos"
                  ></TextField>
                )}
                onChange={(e, v) => mprod(v)}
              />
            </FormControl>

            <TextField
              value={M_Palet}
              inputRef={PaletRef}
              inputProps={{
                onKeyPress: (event) => {
                  const { key } = event;
                  if (key === "Enter") {
                    PesoSacoRef.current.focus();
                  }
                },
              }}
              onChange={(e) => mpalet(e.target.value)}
              label="NºLote-NºPalet"
              sx={{ m: "3px", p: "3px" }}
              error={Err_palet}
            />
            <TextField
              value={M_Cantidad}
              onChange={(e) => mcant(e.target.value)}
              label="Cantidad (kg)"
              sx={{ m: "3px", p: "3px" }}
              error={Cant_Error}
              inputRef={CantRef}
              inputProps={{
                onKeyPress: (event) => {
                  const { key } = event;
                  if (key === "Enter") {
                    RestoRef.current.focus();
                  }
                },
              }}
            />
            <p></p>
            <TextField
              value={M_Peso_Saco}
              onChange={(e) => mpsaco(e.target.value)}
              label="Control Peso Saco(kg)"
              sx={{ m: "3px", p: "3px" }}
              inputRef={PesoSacoRef}
              inputProps={{
                onKeyPress: (event) => {
                  const { key } = event;
                  if (key === "Enter") {
                    CantRef.current.focus();
                  }
                },
              }}
            />
            <TextField
              value={M_Resto}
              onChange={(e) => mresto(e.target.value)}
              label="Resto (kg)"
              sx={{ m: "3px", p: "3px" }}
              error={Resto_Error}
              inputRef={RestoRef}
              inputProps={{
                onKeyPress: (event) => {
                  const { key } = event;
                  if (key === "Enter") {
                    AntRef.current.focus();
                  }
                },
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

            <TextField
              value={M_Observaciones}
              onChange={(e) => mObser(e.target.value)}
              label="Observaciones/Comentarios"
              sx={{ m: "3px", p: "3px", width: "600px" }}
            />
            <br />
            <Button
              sx={{ m: "10px" }}
              onClick={InsertaEnsacado}
              variant="contained"
            >
              Inserta el Ensacado
            </Button>
            
            <Button
              sx={{ m: "10px", visibility:EstadoBotonEliminar}}
              onClick={DeleteEnsacados}
              variant="contained"
              
            >
              Elimina el ensacado seleccionado
            </Button>
            <Button
              sx={{ m: "10px" }}
              onClick={UpdateEnsacado}
              variant="contained"
            >
              Corrige/Modifica el Ensacado
            </Button>
          </Paper>

          <p>
            *Nota : En caso de equivocación en la inserción del ensacado
            seleccione el erroneo en la lista anterior y corrijalo
          </p>
        </Box>
      }
    </Fragment>
  );
}
