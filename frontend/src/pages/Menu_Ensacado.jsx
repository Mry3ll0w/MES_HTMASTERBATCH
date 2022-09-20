import React from 'react'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import {Link} from '@mui/material'
import { styles } from '../Style/styles'


export default function Menu_Ensacado() {

  
  return (
    <div style={styles.TextDiv}>
        <h1 sx={{textAlign:'Center'}}>Bienvenido al menu de ensacados</h1>
        <p>Para modificar un ensacado que ya exista previamente seleccione la opción <b>Nuevo Ensacado</b>.</p>
        <p>Para Insertar un nuevo ensacado o eliminar uno ya existente por favor seleccione la opción <b>Nuevo Ensacado</b></p>
        <Box sx={{p : '3px', m : '3px'}}>
            <Link href='/ModEnsacado' underline='none'><Button style={styles.buttons}>Modificar Ensacado</Button></Link>
            <Link href='/RegEnsacado' underline='none'><Button style={styles.buttons}>Nuevo Ensacado</Button></Link>
            
        </Box>
    </div>
  )
}