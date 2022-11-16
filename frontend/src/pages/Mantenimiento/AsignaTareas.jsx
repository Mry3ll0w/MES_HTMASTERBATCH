import React, { useEffect, useState, Fragment } from "react";
import { Autocomplete, TextField } from "@mui/material";
export default function AsignaTareas() {
  return (
    <Fragment>
      <div className='container d-flex'>
        <div id='Filtros' className='row justify-content-center'>
          <div className='col-6 ml-4'>
            <Autocomplete
              value={FiltroCOD2}
              options={OpcionesCOD2}
              onChange={(e, v) => {
                SetFiltroCOD2(v);
                //Filtramos la lista de tareas
                var l = [];
                var [SelCod] = v.split("|");
                SelCod = String(SelCod);
                l = ListaTareas.filter((i) => i.Cod === `${SelCod}`);
                SetListaTareas(l);
              }}
              renderInput={(e) => (
                <TextField
                  {...e}
                  value={FiltroCOD2}
                  label='Filtrar por COD2'
                  sx={{
                    width: "390px",
                    m: "3px",
                    p: "3px",
                    minWidth: 200,
                  }}
                ></TextField>
              )}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
