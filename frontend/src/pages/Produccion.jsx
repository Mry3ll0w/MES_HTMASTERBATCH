import React from 'react'
import DropDownMenu from '../Components/DropDownMenu'
import { Fragment } from 'react'
import { Button} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { styles } from '../Style/styles'
export default function HomeProduccion() {
  

  
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

  const nav_personal = ()=>{
    navigate('/Personal')
  }

  const nav_regPlanta = () =>{
    navigate('/RegistroPlanta')
  }
 
  const nav_login = () =>{
    navigate('/Login')
  }

  if(sessionStorage.getItem('logged') === null){
    
    nav_login();
    alert('Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario');
    
  }

  if(sessionStorage.getItem('Formulario') === 'Planta' || sessionStorage.getItem('Formulario' === null)){
    nav_login();
    alert('No puedes acceder a este menú')
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
      element: (
        <Button onClick={nav_regPlanta} variant="contained">
          Registro Planta
        </Button>
      ),
    },
    {
      element: (
        <Button onClick={nav_Ensacado} variant="contained">
          Hoja de Ensacado
        </Button>
      ),
    },
  ];

  const menu_Personal = [
    {
      element : <Button  onClick={nav_personal} variant='contained'>Personal</Button>
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
        <td style={styles.td_style}><DropDownMenu elements={menu_Personal} label={"Personal De Planta"} /></td>
        
      </table>
      
    </Fragment>
  )
}
