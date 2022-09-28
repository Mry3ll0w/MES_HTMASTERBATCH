import React, { Fragment } from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import { Typography } from '@mui/material'
import './GestionResiduos.css'
import './Trazabilidad.css'
import tick from './tick.png'
import cancel from './cancel.png'

export default function GestionResiduos() {
    //USESTATES
    const [ResiduoDes,SetResiduoDes] = useState([])
    const [ResiduoRech,SetResiduoRech] = useState('VACIO')
    //ResiduosDes
    const [VentaRDMOD, SetVentaRDMOD] = useState(0)
    //ResiduosRech
    const [PendienteRRMOD, SetPendienteRRMOD] = useState(0)
    const [VentaRRMOD, SetVentaRRMOD] = useState(0)
    const [RecUsoProd, SetRecUsoProd] = useState(0);
    const [LimpiezaTornillo, SetLimpiezaTornillo] = useState(0);
    const [RecUsoVenta, SetRecUsoVenta] = useState(0);
    const [ValoresCorrectos, SetValoresCorrectos] = useState(false)
    //Funciones
    function porcentaje(a,b){
      
      if(parseFloat(a) !== NaN && parseFloat(b) !== NaN)
        return (parseFloat(a) / parseFloat(b)) * 100
      else
        return 'ERROR'
    }

    function icono(e){
      if(e === true)
        return tick;
      else
        return cancel;
    }

    function es_correcto(){
      var r = parseFloat(PendienteRRMOD) + parseFloat(VentaRRMOD) + parseFloat(LimpiezaTornillo) + parseFloat(RecUsoVenta) 
      if (
        r >
        parseFloat(ResiduoRech.rechazo)
      ) {
        alert(
          `Valor incorrecto, no se puede superar el valor de rechazo`
        );
        SetValoresCorrectos(false);
      } else {
        
        SetValoresCorrectos(true);
        //Enviamos a la API
        axios.post(
          `http://${process.env.REACT_APP_SERVER}/RegistroPlanta/GestionDesperdicios`,
          {
            OF : sessionStorage('OF'),
            Des : {
              VentaR: ResiduoDes.VentaR
            },
            Rech: {
              Pendiente : PendienteRRMOD,
              VentaRe: VentaRRMOD,
              RecUsoProd : RecUsoProd,
              LimpiezaTornillo: LimpiezaTornillo,
              RecUsoVenta: RecUsoVenta 
            }
          }
        );
      }
    }

    //DATA FETCH
    useEffect(()=>{
        
        axios
          .get(
            `http://${process.env.REACT_APP_SERVER}/RegistroPlanta/GestionDesperdicios/${sessionStorage.getItem('OF')}`
          )
          .then((response) => {
            console.table(response.data.Rech)
            SetResiduoDes(response.data.Des)
            SetResiduoRech(response.data.Rech)
            SetVentaRDMOD(response.data.Des.VentaR)
            var Rech = response.data.Rech;
            SetPendienteRRMOD(Rech.Pendiente)
            SetVentaRRMOD(Rech.VentaRe)
            SetRecUsoProd(Rech.RecUsoProd)
            SetLimpiezaTornillo(Rech.LiemTor)
            SetRecUsoVenta(Rech.Recupe)
            es_correcto()
          })
          .catch((error) => console.log(error));
        
    },[])

  return (
    <Fragment>
      <div className="tittleDivGR">
        <Typography fontSize={"25px"}>
          Gestión de Residuos/Desperdicios
        </Typography>
      </div>
      <div className="ResiduosDes">
        <table className="centeredTableGR">
          <tbody>
            <tr>
              <th className="thGR">
                <Typography fontSize={"20px"}>OF</Typography>
              </th>
              <th className="thGR">
                <Typography fontSize={"20px"}>Desperdicio</Typography>
              </th>
              <th className="thGR">
                <Typography fontSize={"20px"}>Venta de Reciclaje</Typography>
              </th>
              <th className="thGR">
                <Typography fontSize={"20px"}>%</Typography>
              </th>
              <th className="thGR">
                <Typography fontSize={"20px"}>Nº Bulto</Typography>
              </th>
              <th className="thGR">
                <Typography fontSize={"20px"}>Año</Typography>
              </th>
              <th className="thGR">
                <Typography fontSize={"20px"}>Modificado</Typography>
              </th>
            </tr>
            <tr>
              <td className="tdGR">
                <Typography fontSize={"16px"}>{ResiduoDes.OF}</Typography>
              </td>
              <td className="tdGR">
                {/** DESPERDICIO TIENE ERRATA ES DESPERCIDIO LA ORIGINAL */}
                <Typography fontSize={"16px"}>
                  {ResiduoDes.Despercidio}
                </Typography>
              </td>
              <td className="mutabletdGR">
                <Typography fontSize={"16px"}>
                  <input
                    className="inputGR"
                    value={VentaRDMOD}
                    onChange={(e) => {SetVentaRDMOD(e.target.value); }}
                  />
                </Typography>
              </td>
              <td className="tdGR">
                {porcentaje(ResiduoDes.VentaR, ResiduoDes.Despercidio)}
              </td>
              <td className="tdGR">
                <Typography fontSize={"16px"}>{ResiduoDes.BB}</Typography>
              </td>
              <td className="tdGR">
                <Typography fontSize={"16px"}>{ResiduoDes.Anno}</Typography>
              </td>
              <td className="tdGR">
                <Typography fontSize={"16px"}>{ResiduoDes.Modpor}</Typography>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="TablaResiduosRechGR">
          <table>
            <tbody>
              <tr>
                <th className="thGR">
                  <Typography fontSize={"15px"}>OF</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Rechazo</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Pendiente</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>%</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Venta Reciclaje</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>%</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Rec Uso Producción</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>%</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Limpieza Tornillo</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>%</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Rec Uso Venta</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>%</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Nº Bulto</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Año</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Material</Typography>
                </th>
                <th className="thGR">
                  <Typography fontSize={"15px"}>Último Mod</Typography>
                </th>
              </tr>
              <tr>
                <td className="tdGR">
                  <Typography fontSize={"14px"}>{ResiduoRech.OF}</Typography>
                </td>
                <td className="tdGR">
                  <Typography fontSize={"14px"}>
                    {ResiduoRech.rechazo}
                  </Typography>
                </td>
                <td className="mutabletdGR">
                  <Typography fontSize={"14px"}>
                    <input
                      className="inputGR"
                      value={PendienteRRMOD}
                      onChange={(e) => SetPendienteRRMOD(e.target.value)}
                    />
                  </Typography>
                </td>
                <td className="tdGR">
                  {porcentaje(PendienteRRMOD, ResiduoRech.rechazo)}
                </td>
                <td className="mutabletdGR">
                  <Typography fontSize={"14px"}>
                    <input
                      className="inputGR"
                      value={VentaRRMOD}
                      onChange={(e) => SetVentaRRMOD(e.target.value)}
                    />
                  </Typography>
                </td>

                <td className="tdGR">
                  {porcentaje(VentaRRMOD, ResiduoRech.rechazo)}
                </td>

                <td className="mutabletdGR">
                  <Typography fontSize={"14px"}>
                    <input
                      className="inputGR"
                      value={RecUsoProd}
                      onChange={(e) => SetRecUsoProd(e.target.value)}
                    />
                  </Typography>
                </td>
                <td className="tdGR">
                  {porcentaje(RecUsoProd, ResiduoRech.rechazo)}
                </td>
                <td className="mutabletdGR">
                  <Typography fontSize={"14px"}>
                    <input
                      className="inputGR"
                      value={LimpiezaTornillo}
                      onChange={(e) => SetLimpiezaTornillo(e.target.value)}
                    />
                  </Typography>
                </td>
                <td className="tdGR">
                  {porcentaje(LimpiezaTornillo, ResiduoRech.rechazo)}
                </td>

                <td className="mutabletdGR">
                  <Typography fontSize={"14px"}>
                    <input
                      className="inputGR"
                      value={RecUsoVenta}
                      onChange={(e) => SetRecUsoVenta(e.target.value)}
                    />
                  </Typography>
                </td>
                <td className="tdGR">
                  {porcentaje(RecUsoVenta, ResiduoRech.rechazo)}
                </td>
                <td className="tdGR">{ResiduoRech.BB}</td>
                <td className="tdGR">{ResiduoRech.Anno}</td>
                <td className="tdGR">{ResiduoRech.Material}</td>
                <td className="tdGR">{ResiduoRech.Modpor}</td>
                
              </tr>
            </tbody>
          </table>
          <div className='boton'>
            <button className='botonGR' onClick={()=>{es_correcto()}}>Modificar los valores</button>
          </div>
          <br />
          <div className='EstadoResiduo'>
            <Typography fontSize={'25px'}>
              Estado 
              <br /><img src = {icono(ValoresCorrectos)}/>
            </Typography>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
