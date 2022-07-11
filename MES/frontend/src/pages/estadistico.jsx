import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dateFormat from 'dateformat';
import { Box } from '@mui/system';
import {Checkbox, FormControlLabel, Menu,MenuItem, Button, Paper} from '@mui/material';
import { useState } from 'react';
import { styles } from '../Style/styles';
import { es } from 'date-fns/locale';

export default function BasicDateTimePicker() {
  
  //UseStates para controlar 
  const [Fecha_Limite_Inferior, setInferior] = useState(new Date());
  const [Fecha_Limite_Superior, setSuperior] = useState(new Date());
  const [Tendencias, setTendencias] = useState('');
  const [Productos,setProductos]=useState([]);
  const [OFs,setOFs]=useState([]);

  const [Selector_f_rango,setRango] = useState('');
  const [Selector_OF,setOF] = useState(false);
  const [Selector_Prod, setSelProd] = useState(false);

  //Visuales para menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  


  return (
    <Fragment>
      <div>
      
      
      {/*Drop filtro */}
      <Button
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"
      >
        Filtrar
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() =>{
          setAnchorEl(null);
          setRango(false);
          setOF(true);
          setSelProd(true);
        }}>
          Filtrar por Fecha
        </MenuItem>
        <MenuItem onClick={() =>{
          setAnchorEl(null);
          setRango(true);
          setOF(false);
          setSelProd(true);
        }}>Filtrar por OF </MenuItem>
        <MenuItem onClick={() => {
          setAnchorEl(null);
          setRango(true);
          setOF(true);
          setSelProd(false);
        }}>Filtar por Producto</MenuItem>
      </Menu>

      <br />
      <br />
      //Formulario
      <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      >
      <div>
      <div>  
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
          <DateTimePicker
            style={styles.timepickers}
            renderInput={(props) => <TextField {...props} />}
            label="Limite Inferior"
            value={Fecha_Limite_Inferior}
            onChange={(e) => {
              setInferior(e);
            }}
            disabled={Selector_f_rango}
          />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
          
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label="Limite Superior"
            value={Fecha_Limite_Superior}
            onChange={(newValue) => {
              setSuperior(newValue);
            }}
            disabled={Selector_f_rango}
          />

          </LocalizationProvider>
      </div>
      <div>{/** Filtro por Of */}
        AUTOCOMPLETADO OF
      </div>
      <div>
        
        Autocompletado Productos
        
      </div>
    </div>
    </Box>  
    </div> 
    
    </Fragment>
    
  );
}