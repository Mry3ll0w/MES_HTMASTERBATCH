import React, { Fragment } from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { Typography } from '@mui/material'
import './GestionResiduos.css'
import './Trazabilidad.css'
export default function GestionResiduos() {
    //USESTATES
    const [ResiduoDes,SetResiduoDes] = useState([])
    const [ResiduoRech,SetResiduoRech] = useState([])

    //DATA FETCH
    useEffect(()=>{
        axios
          .get(`http://192.168.0.118:4001/RegistroPlanta/GestionDesperdicios/${sessionStorage.getItem('OF')}`)
          .catch((e) => console.log(e))
          .then((response) => {
            
            SetResiduoDes(response.data.ResiduoDes)
            SetResiduoRech(response.data.ResiduoRech)

          });
    })

  return (
    <Fragment>
      <div className="tittleDivGR">
        <Typography fontSize={"25px"}>
          Gestión de Residuos/Desperdicios
        </Typography>
      </div>
      <div className="ResiduosDes">
        <table>
          <tbody>
            <Typography fontSize={"20px"}>
                <th className="thGR">OF</th>
                <th className='thGR'>Desperdicio</th>
                <th className='thGR'>Venta de Reciclaje</th>
                <th className='thGR'>%</th>
                <th className='thGR'>Nº Bulto</th>
                <th className='thGR'>Año</th>
                <th className='thGR'>Modificado</th>
            </Typography>
            <tr>
                {
                    ResiduoDes.map( i => {
                        return (
                            <Typography fontSize={'16px'}>
                            
                                <td className='tdGR'>{i.OF}</td>
                                <td className='tdGR'>{i.Desperdicio}</td>
                            </Typography>
                        )
                    })
                }
            </tr>
                
            
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}
