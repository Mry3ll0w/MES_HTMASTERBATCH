import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Button} from '@mui/material'
import { useState } from 'react';
import {Drawer} from '@mui/material'
import { styles } from '../Style/styles';
import { useNavigate } from 'react-router-dom';


export function Header () {
  
  //Gestiona apertura o cierre del drawer
  const [OpenMenu, openmenu]=useState(false);

  //Navegabilidad de los botones
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            onClick = {() => {openmenu(true)}}
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}

          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            M.E.S. UNNOX-HT
          </Typography>
          
        </Toolbar>

        <Drawer style={styles.drawer} open={OpenMenu} onClose={() => {openmenu(false)}} >
          <Box sx={{width : '400px', marginTop: '20px'}}>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Opciones Disponibles
            </Typography>
            <Button style={styles.buttons} onClick={() => {navigate('/');openmenu(false)}} variant='contained'>Departamento de Produccion</Button>
            
          </Box>

        </Drawer>

      </AppBar>
    </Box>
  );
}