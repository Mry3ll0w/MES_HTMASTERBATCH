import React, { Fragment } from 'react'
import HomeProduccion from "./menu_departamentos/Produccion";
import HomeMantenimiento from "./menu_departamentos/Mantenimiento";
import HomePlanta from "./menu_departamentos/Planta";

function Selector_Menu(){
    
    
        if(sessionStorage.getItem('Formulario').includes('Produccion'))
            return <HomeProduccion />
        else if(sessionStorage.getItem('Formulario').includes('Mantenimiento'))
            return <HomeMantenimiento />
        else if(sessionStorage.getItem('Formulario').includes('Planta'))
            return  <HomePlanta />
        
    
}

export default function Home() {
  return (
    <Fragment>
        {Selector_Menu()}
    </Fragment>
  )
}
