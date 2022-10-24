import React from "react";
import DropDownMenu from "../../Components/DropDownMenu";
import { Fragment } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./menu.css";

export default function HomePlanta() {
  const navigate = useNavigate();

  function handle_nav(str) {
    navigate(str);
  }

  if (sessionStorage.getItem("logged") === null) {
    handle_nav("/login");
    alert(
      "Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario"
    );
  }

  const menu_planta = [
    {
      element: (
        <Button onClick={() => navigate("/RegEnsacado")} variant='contained'>
          Hoja de Ensacado
        </Button>
      ),
    },
    {
      element: (
        <Button
          onClick={() => navigate("/Mantenimiento/Tareas")}
          variant='contained'
        >
          Tareas
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
      <div className='MenuDiv'>
        <DropDownMenu elements={menu_planta} label='Registro de Planta' />
      </div>
    </Fragment>
  );
}
