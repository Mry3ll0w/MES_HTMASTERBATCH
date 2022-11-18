import React from "react";
import DropDownMenu from "../../Components/DropDownMenu";
import { Fragment } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./menu.css";
import { useEffect } from "react";

export default function HomePlanta() {
  const navigate = useNavigate();

  function handle_nav(str) {
    navigate(str);
  }

  useEffect(() => {
    if (sessionStorage.getItem("logged") === null) {
      handle_nav("/login");
      alert(
        "Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario"
      );
    }
  }, []);

  const menu_planta = [
    {
      element: (
        <Button onClick={() => navigate("/RegEnsacado")} variant='contained'>
          Hoja de Ensacado
        </Button>
      ),
    },
  ];

  const menu_tareas = [
    {
      element: (
        <Button
          onClick={() => navigate("/Mantenimiento/Tareas")}
          variant='contained'
        >
          Inputar/Modificar Tareas
        </Button>
      ),
    },
    {
      element: (
        <Button
          onClick={() => navigate("/Planta/TareasAsignadas")}
          variant='contained'
        >
          Tareas Asignadas (pendientes)
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <div className='TitleDiv'>
        <Typography fontSize={"25px"}>Menú de Planta</Typography>
      </div>
      <br />
      <div className='row d-flex ms-4'>
        <div className='col d-flex'>
          <DropDownMenu elements={menu_planta} label='Registro de Planta' />
        </div>
        <div className='col d-flex'>
          <DropDownMenu elements={menu_tareas} label='Tareas' />
        </div>
      </div>
    </Fragment>
  );
}
