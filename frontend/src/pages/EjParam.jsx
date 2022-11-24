import React from 'react'
import { useParams } from 'react-router-dom'
export default function EjParam() {
    var {username} = useParams();
  return (
    <div>EjParam:{username} </div>
  )
}
