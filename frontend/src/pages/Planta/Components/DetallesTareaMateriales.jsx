import React,{Fragment, useEffect, useReducer,useState} from 'react'
import axios from 'axios'
import Select from 'react-select'
export default function DeteallesTareaMateriales({AccionID}) {

  // useStates
  const [aOpsMateriales,setaOpsMateriales] = useState([])
  const [aMaterialesUsados, dispatchMaterialesUsados] = useReducer(
    (state = [], action) => {
      switch (action.type) {
        case "initializeMaterial": {
          if (state.filter((i) => i.ID === action.payload.ID) !== 0)
            return [
              ...state,
              {
                index: state.length,
                option: {value: action.payload.ID, label: `${action.payload.Descripcion}`},
                Cantidad: action.payload.Cantidad
              },
            ];
          else {
            return state;
          }
        }

        case "addMaterial": {
          return [
            ...state,
            {
              index: state.length,
              option: "vacio",
              Cantidad: "1",
            },
          ];
        }

        case 'clearAll':{
          return state.filter(i => i.index === -1);
        }

        case 'modSeleccionMaterial':{
            return state.map((item, i) => i === action.index 
                ? {...item, option: {value: action.selectedOption.value, label: action.selectedOption.label}}
                : item
            )
        }

        case "modCantidad": {
          return state.map((item, i) => i === action.index 
                ? {...item, Cantidad: action.Cantidad}
                : item
            )
        }

        case 'eraseIndex':{
            return state.filter(i => i.index !== action.index);
        }

        default: {
          return state;
        }
      }
    }
  );

  useEffect(() => {
    axios.post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas/DetallesTarea/Accion/Materiales`,{
      iAccionID: AccionID
    })
    .catch(e => console.log(e))
    .then(r => {
      try{
        dispatchMaterialesUsados({type: 'clearAll'})
        var _aOpsMateriales = []
        r.data.aMateriales.forEach( i => {
          _aOpsMateriales = [..._aOpsMateriales, {value: i.ID, label: i.Descripcion}]
        })
        setaOpsMateriales(_aOpsMateriales);
        r.data.aMaterialesImplicados.forEach( i => {
          dispatchMaterialesUsados({type: 'initializeMaterial', payload: i});
        })
      }
      catch(e){
        console.log(e)
        alert('Error obteniendo datos del servidor, comprueba el estado del mismo')
      }
    })
  },[])

    return(
      <Fragment>
          <div className='row d-flex'>
      <p className='h3 mt-3 mb-3'>
          Materiales usados en la accion
      </p>
      </div>
      <div className='row d-flex'>
          <div className='table table-responsive-sm'>
          <table>
              <thead>
                  <th scope='col' className='text-center p-2'>Cantidad utilizada</th>
                  <th scope='col' className='text-center p-2' >Descripción</th>
              </thead>
              <tbody>
                {aMaterialesUsados && aMaterialesUsados.map(i=>{
                  return(
                    <Fragment>
                      <tr>
                        <td key={Math.random()} className='p-2 border border-dark text-center'>
                          <input 
                            type='number'value={i.Cantidad} 
                            min={0}
                            className='w-50 text-center' 
                            onChange={(e) => {
                              dispatchMaterialesUsados({type: 'modCantidad', index: i.index, Cantidad: e.target.value});
                            }}
                          />
                        </td>
                        <td key={Math.random()} className='p-2 border border-dark text-center'>
                          <Select 
                            options={aOpsMateriales}
                            isSearchable={true}
                            onChange={(e) => {
                              dispatchMaterialesUsados({type: 'modSeleccionMaterial', index: i.index, selectedOption: e});
                            }}
                            value={i.option}
                          />
                        </td>
                        <td key={Math.random()} className='p-2 border border-dark text-center'>
                          <button 
                            className='btn bnt-primary small' onClick={()=> dispatchMaterialesUsados({type: 'eraseIndex', index: i.index})} 
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    
                    </Fragment>
                  )
                })}
              </tbody>
          </table>
      </div>
      <div className='row'>
        <button 
          className='btn btn-primary small w-25' 
          onClick={()=> dispatchMaterialesUsados({type: 'addMaterial'})}
        >
          Agregar Material
        </button>
      </div>
      </div>
      </Fragment>
  )
}
