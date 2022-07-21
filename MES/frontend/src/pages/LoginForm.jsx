import React, { useEffect } from 'react'
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { TextField,Autocomplete, Button } from '@mui/material';
import { useState} from 'react';
import axios from 'axios';
//const {scryptSync, randomBytes} = require('crypto')
const bcrypt = require('bcryptjs');



export default function LoginForm() {
    
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
            console.log(Usuarios)
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
            
            var verified = bcrypt.compareSync(Pass,Sel_user.Pwd_Hashed)
            if(verified){
                alert('Correcto');
            }
            else
                alert('Incorrecto')

        }
    }
    

  return (
    <Fragment>
        
        <TextField value={User} error = {UserError} onChange={e => Setuser(e.target.value)} label='Usuario'></TextField>
        <TextField value={Pass} error={PassError} onChange={e => setPass(e.target.value)} label='Contraseña'></TextField>
        <Button onClick={send_data}>Iniciar Sesion</Button>

    </Fragment>
  )
}
