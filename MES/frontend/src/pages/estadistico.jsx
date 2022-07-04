
import React, { Fragment, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'
//Encargado de mostrar el estadistico de determinadas tendencias en una producción realizada en un tramo horario
export default function Estadistico() {
    
    const [Selecteds, Setselecteds] = useState([]);
    let ids = new Set();
    const columns = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'firstName', headerName: 'First name', width: 130 },
      { field: 'lastName', headerName: 'Last name', width: 130 },
      {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
      },
     
    ];
    
    const rows = [
      { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
      { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
      { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
      { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
      { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
      { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
      { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
      { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
      { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];
  return (
    <Fragment>
       <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        onSelectionModelChange={ (i) =>{
         
          const selectedIDs = new Set(i);
          const selectedRowData = rows.filter((row) =>
            selectedIDs.has(row.id)
          );
          console.log(selectedRowData);
          Setselecteds(selectedRowData);
        }
        }
      />
    </div>
    <p>{Selecteds.length}</p>
    <div>{Selecteds.map((i)=>{
      return <h1> Nombre: {i.firstName} Apellido: {i.lastName}</h1>
    })}</div>
    
    </Fragment>
  )
}

