import React, { Fragment } from 'react'
import HomeProduccion from './Produccion'
import HomeMantenimiento from './Mantenimiento';
import HomePlanta from './Planta';
function Selector_Menu(){
    
    switch(sessionStorage.getItem('Formulario')){
        case 'Produccion':
            return <HomeProduccion />
        break;
        case 'Mantenimiento':
            return <HomeMantenimiento />
        break;
        case 'Planta':
            return  <HomePlanta />
        break;
    }
}

export default function Home() {
  return (
    <Fragment>
        {Selector_Menu()}
    </Fragment>
  )
}
