import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, esES, GridToolbar } from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";

export default function TareasAsignadas() {
  //UseStates
  const [aTareas, SetaTareas] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      sessionStorage.getItem("codigo") === null ||
      sessionStorage.getItem("iniciales") === null
    ) {
      navigate("/Login");
    }
    axios
      .post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas`, {
        Codigo: sessionStorage.getItem("codigo"),
      })
      .catch((e) => console.log(e))
      .then((response) => {
        console.log(response);
      });
  }, []);

  return (
    <Fragment>
      <div className='container'>
        <div className='row'>
          <p className='h3 d-flex justify-content-center'>
            Tareas pendientes asignadas:{" "}
          </p>
        </div>
        <div className='row d-inline'></div>
      </div>
    </Fragment>
  );
}
