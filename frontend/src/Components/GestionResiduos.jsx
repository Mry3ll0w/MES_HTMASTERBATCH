import React from 'react'
import { useEffect,useState } from 'react'
import axios from 'axios'
import './Trazabilidad.css'//Reciclamos CSS ya que es el mismo estilo
export default function GestionResiduos() {
    
    useEffect(()=>{
        axios
          .get("http://192.168.0.118:4001/RegistroPlanta/GestionDesperdicios")
          .catch((e) => console.log(e))
          .then((response) => {
            console.log(response.data)
          });
    })

  return (
    <div>GestionResiduos</div>
  )
}
