import React from "react";
import DropDownMenu from "../../Components/DropDownMenu";
import { Fragment } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styles } from "../../Style/styles";
import "./menu.css";

export default function HomeMantenimiento() {
  const navigate = useNavigate();

  //Control de acceso no permitido
  if (
    sessionStorage.getItem("Formulario") === null ||
    sessionStorage.getItem("Formulario") === "Planta"
  ) {
    navigate("/home");
    alert("No tienes acceso a esta página");
  }
  const menu_tareas = [
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
    {
      element: (
        <Button
          onClick={() => navigate("/Mantenimiento/AsignarTareas")}
          variant='contained'
        >
          Asignar Tareas
        </Button>
      ),
    },
  ];
  const menu_maquinas = [
    {
      element: (
        <Button
          onClick={() => navigate("/Mantenimiento/RepuestosMaquina")}
          variant='contained'
        >
          Repuestos De Las Máquinas
        </Button>
      ),
    },
  ];

  return (
    <Fragment>
      <div className='container'>
        <div className='row'>
          <h1>Departamento de Mantenimiento</h1>
        </div>
        <br />
        <div className='row'>
          <div className='col'>
            <DropDownMenu
              elements={menu_tareas}
              label='Gestión de Tareas/Seguimientos'
            />
          </div>
          <div className='col'>
            <DropDownMenu
              elements={menu_maquinas}
              label='Gestion de Maquinaria'
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
