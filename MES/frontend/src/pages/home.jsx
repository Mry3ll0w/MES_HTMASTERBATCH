import React from 'react'
import DropDownMenu from '../Components/DropDownMenu'
import { Fragment } from 'react'
import { Button,Link } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styles } from '../Style/styles'
export default function Home() {
  
  
  const navigate = useNavigate();
  
  const nav_estadistico = () =>{
    navigate('/Estadistico')
  }

  const nav_graEstadistico = () =>{
    navigate('/graficaEstadistico')
  }
  
  const nav_Ensacado = () => {
    navigate('/RegEnsacado');
  }

  
  const menu_resumen = [
    {
      element : <Button  onClick={nav_estadistico} variant='contained'>Estadistico</Button>
    },
    {
      element : <Button  onClick={nav_graEstadistico} variant='contained'>Grafica Estadistico</Button>
    },
  ];

  const menu_RegistroPlanta = [
    {
      element : <Button  onClick={nav_Ensacado} variant='contained'>Hoja de Ensacado</Button>
    }
  ];


  return (
    <Fragment>
      <div>
        <h1>Bienvenido al Departamento de Producción</h1>
      </div>
      <table>
        <td style={styles.td_style}><DropDownMenu elements={menu_resumen} label={"Resumen"} /></td>
        <td style={styles.td_style}><DropDownMenu elements={menu_RegistroPlanta} label={"Registro de Planta"} /></td>
        
      </table>
      
    </Fragment>
  )
}
