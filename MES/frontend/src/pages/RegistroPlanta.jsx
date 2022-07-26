import React,{useState,useEffect, Fragment} from 'react'
import axios from 'axios'
import { TextField,Button, Autocomplete } from '@mui/material'
import { styles } from '../Style/styles';
import { DataGrid, esES} from '@mui/x-data-grid';
import clsx from 'clsx';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import dateFormat from 'dateformat';
export default function RegistroPlanta() {

    //Variables para guardar los datos
    const [DatosPlanta,setDatosPlanta] = useState([]);
    const [DatosPost,setDatosPost] = useState([]);
    //Para obtener los valores de los campos para el registro de la planta
    useEffect(()=>{
        axios.get('http://localhost:4001/RegPlanta')
        .catch(error=>console.log(error))
        .then(response=>{
            setDatosPlanta(response.data.Datos)
        })
    },[])
    //console.log(DatosPlanta)
    const columns = [
        {field : 'Estado' ,renderCell : (rowData) => {
          //console.log(rowData.row)
          if(rowData.row.Estado === 1){
            return <DoneOutlineIcon />
          }
          else{
            return <CancelIcon />
          }
        },
        width : '65'
      },
        { field: "OF", headerName: "OF", width: "60" },
        { field: "ProductoID", headerName: "Producto", width: "150" },
        { field: "Rechazo", headerName: "Rechazo", width: "80" },
        { field: "Plasta", headerName: "Plasta", width: "80" },
        { field: "Seleccion", headerName: "Selección", width: "90" },
        { field: "Desperdicio", headerName: "Desperdicio", width: "90" },
        { field: "HoraInicio", headerName: "Hora Inicio", width: "85" },
        { field: "FechaHoraRegInicio", headerName: "Fecha Inicio", width: "150" },
        { field: "HoraFin", headerName: "Hora Fin", width: "85" },
        { field: "FechaFin", headerName: "Fecha Fin", width: "100" },
        { field: "Observacion", headerName: "Observaciones", width: "400", height: '100' },
    ];
    
    let rows = DatosPlanta;
    rows.map((i,n)=>{
            i.id = n++;
            i.FechaHoraRegInicio = dateFormat(i.FechaHoraRegInicio, "dd/mm/yyyy");
            i.FechaFin = dateFormat(i.FechaFin, "dd/mm/yyyy");
            i.HoraInicio = dateFormat(i.HoraInicio, "HH:MM");
            i.HoraFin = dateFormat(i.HoraFin, "HH:MM");
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
            //Seleccion del ensacado, filtramos por OF y TurnoID (1,2,5)
            axios.post('http://localhost:4001/RegPlanta',{
                
                    OF : selectedRowData[0].OF,
                    TurnoID : selectedRowData[0].TurnoID,
                
            }).response(r =>setDatosPost(r.data.Datos))
            .catch(error=>console.log(error))
          }}
          
        />
        </div>
    </Fragment>
    
  )
}
