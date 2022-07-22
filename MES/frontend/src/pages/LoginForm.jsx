import React, { useEffect } from 'react'
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { TextField,Autocomplete, Button } from '@mui/material';
import { useState} from 'react';
import axios from 'axios';
import { styles } from '../Style/styles';
//const {scryptSync, randomBytes} = require('crypto')
const bcrypt = require('bcryptjs');



export default function LoginForm({LoginLogo}) {
    
    const [Usuarios,setUsuarios]= useState([]);
    const [User,Setuser]= useState('');
    const [Pass,setPass]= useState('');
    const [UserError,setUerror]= useState(false);
    const [PassError,setPassError] = useState(false);
    const [Verified,setVerified] = useState(false)

    useEffect(() => {
        axios
          .get("http://192.168.0.123:4001/Login")
          .then((response) => {
            
            setUsuarios(response.data.user);
            //console.log(Usuarios)
          })
          .catch((error) => console.log(error));
      }, []);
    
    function send_data(){
        //console.log(`DENTRO DE CLICK`)
        if(User === ''){
            alert('No dejes el usuario en Blanco')
            setUerror(true)
        }
        else{
            setUerror(false);
        }

        if(Pass === ''){
            alert('No dejes la contraseña en blanco')
            setPassError(true);
        }
        else{
            setPassError(false);
        }

        if(User != '' && Pass != ''){
            
            
            const Sel_user = Usuarios.filter(i => i.Codigo === User);
            console.log(Pass)
            console.log(Sel_user[0].Pwd_Hashed)
            var verified = bcrypt.compareSync(Pass,Sel_user[0].Pwd_Hashed)
            
            if(verified){
                alert('Acceso Correcto');
            }
            else
                alert('Acceso Incorrecto')

        }
    }
    

  return (
    <Fragment>
        <div 
            style={styles.centered_div}
        >
            <img width={250} src={LoginLogo}/>
        </div>
        <br></br> <br></br>
        <div style={styles.centered_div}>
            
            <Autocomplete
                options={Usuarios}
                getOptionLabel={(o) => o.Codigo}
                renderInput={(e) => (
                  <TextField {...e} value={User} error = {UserError} onChange={e => Setuser(e.target.value)} sx={{margin:5}} label='Usuario'></TextField>
            
                )}
                onChange={(e, v) => Setuser(v.Codigo)}
                freeSolo
                sx={{margin : 5}}
            />
            
            
            <TextField value={Pass} error={PassError} onChange={e => setPass(e.target.value)} sx={{margin :5}} label='Contraseña' type="password"></TextField>
            
            <Button onClick={send_data} variant='contained'>Iniciar Sesion</Button>
        </div>
        <div>
            
                
            
            
        </div>
        
    </Fragment>
  )
}
