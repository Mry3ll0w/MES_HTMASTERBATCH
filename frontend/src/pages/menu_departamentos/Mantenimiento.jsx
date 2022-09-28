import React from "react";
import DropDownMenu from "../../Components/DropDownMenu";
import { Fragment } from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styles } from "../../Style/styles";
import './menu.css'



export default function HomeMantenimiento() {
  
  const navigate = useNavigate();
  



  //Control de acceso no permitido
  if (
    sessionStorage.getItem("Formulario") === null ||
    sessionStorage.getItem("Formulario") === 'Planta'
  ){
    navigate('/home')
    alert('No tienes acceso a esta página')
  }
  const menu_tareas = [
      {
        element: (
          <Button onClick={()=> navigate("/Mantenimiento/Tareas")} variant="contained">
            Tareas
          </Button>
        ),
      },
    ];
    
    
    return (
    <Fragment>
      <div className="TitleDiv">
        <Typography fontSize={"25px"}>Departamento de Mantenimiento</Typography>
      </div>
      <br />
      <div className="MenuDiv">
        <DropDownMenu elements={menu_tareas} label='Gestión de Tareas/Seguimientos' />
      </div>
    </Fragment>
  )
  
}
