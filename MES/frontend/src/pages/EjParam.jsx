import React from 'react'
import { useParams } from 'react-router-dom'
export default function EjParam() {
    let {username} = useParams();
  return (
    <div>EjParam:{username} </div>
  )
}
