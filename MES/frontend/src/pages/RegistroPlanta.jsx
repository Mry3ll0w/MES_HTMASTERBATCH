import React,{useState,useEffect, Fragment} from 'react'
import axios from 'axios'
import { TextField,Button, Autocomplete } from '@mui/material'
import { styles } from '../Style/styles';
import { DataGrid, esES} from '@mui/x-data-grid';
import clsx from 'clsx';
export default function RegistroPlanta() {

    //Variables para guardar los datos
    const [DatosPlanta,setDatosPlanta] = useState([]);
    let cssRow = '';
    
    //Para obtener los valores de los campos para el registro de la planta
    useEffect(()=>{
        axios.get('http://localhost:4001/RegPlanta')
        .catch(error=>console.log(error))
        .then(response=>{
            setDatosPlanta(response.data.Datos)
        })
    },[])
    console.log(DatosPlanta)
    const columns = [
        { field: "OF", headerName: "OF", width: "150" ,cellClasName: cssRow},
        { field: "ProductoID", headerName: "Producto", width: "150" },
        { field: "FechaInicio", headerName: "F.Inicio", width: "150" },
        { field: "Rechazo", headerName: "Rechazo", width: "150" },
        { field: "Plasta", headerName: "Plasta", width: "150" },
        { field: "Seleccion", headerName: "Selección", width: "150" },
        { field: "Desperdicio", headerName: "Desperdicio", width: "150" },
        { field: "HoraInicio", headerName: "Hora Inicio", width: "150" },
        { field: "FechaIncio", headerName: "Fecha Inicio", width: "150" },
        { field: "HoraFin", headerName: "Hora Fin", width: "150" },
        { field: "FechaFin", headerName: "Fecha Fin", width: "150" },
        { field: "Observacion", headerName: "Observaciones", width: "150" },
    ];
    
    let rows = []
    DatosPlanta.map(i=>{
            rows = [...rows,{
                id : i.ID,
                OF : i.OF,
                ProductoID : i.ProductoID,
                FechaInicio : i.FechaInicio,
                Rechazo : i.Rechazo,
                Plasta : i.Plasta,
                Seleccion : i.Seleccion,
                Desperdicio : i.Desperdicio,
                HoraInicio : i.HoraInicio,
                FechaIncio : i.FechaIncio,
                HoraFin : i.HoraFin,
                FechaFin : i.FechaFin,
                Observacion : i.Observacion,
            }]
            
        }
    );

  return (
    <Fragment>
        <div style={styles.AdjustableLeftBox}>
        <DataGrid
          localeText={esES.components.MuiDataGrid.defaultProps.localeText} 
          rows={rows}
          columns={columns}
          pageSize={100}
          //checkboxSelection
          rowsPerPageOptions={[10]}
          onSelectionModelChange={(r) => {
            const selectedIDs = new Set(r);
            const selectedRowData = rows.filter((row) =>
              selectedIDs.has(row.id)
            );
            console.log(selectedRowData);
            //Creacion Ensacado
            selectedRowData.map((i) => {
              
            });
            
          }}
        />
        </div>
    </Fragment>
    
  )
}
