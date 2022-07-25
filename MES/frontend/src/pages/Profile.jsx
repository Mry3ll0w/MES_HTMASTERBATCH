import React, { Fragment } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Box } from '@mui/system';
export default function Profile() {

    const navigate = useNavigate();
    const nav_login = () =>{
        navigate('/Login')
      }
    
      if(sessionStorage.getItem('logged') === null){
        
        nav_login();
        alert('Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario');
        
      }

  return (
    <Fragment>
        <div>
            <h1>Bienvenido {sessionStorage.getItem('logged')}</h1>
            <Box>
                
            </Box>
        </div>
    </Fragment>
  )
}
