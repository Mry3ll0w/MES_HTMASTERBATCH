import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
export default function DetallesTarea({
  Tarea,
  Accion,
  EmpleadosAccion,
  MaterialAccion,
}) {
  //UseStates
  const [sEstadoTarea, SetsEstadoTarea] = useState("");
  useEffect(() => {
    if (Tarea.EstadoTarea === "Pendiente") SetsEstadoTarea("Realizado");
    else if (Tarea.EstadoTarea === "Realizado") SetsEstadoTarea("Pendiente");
  }, [Tarea]);
  console.log(Tarea);
  return (
    <Fragment>
      <div className='row d-flex ms-1'>
        <div className='col'>
          <p className='h5'>Codigo de la Tarea: {Tarea.Codigo}</p>
        </div>
        <div className='col'>
          <p className='h5'>
            {" "}
            Fecha Programada :{" "}
            <input
              type='date'
              style={{ padding: "3px" }}
              readOnly={true}
              value={Tarea.FechaProgramada}
            />
          </p>
        </div>
      </div>
      <div className='row d-flex mt-2 ms-1'>
        <div className='col'>
          <p className='h5'> Criticidad : {Tarea.Criticidad} </p>
        </div>
        <div className='col'>
          <p className='h5'>
            {" "}
            Estado (inicial) de la Tarea: {Tarea.EstadoTarea}{" "}
          </p>
        </div>
      </div>
      <div className='row d-flex mt-2 ms-1 w-75'>
        <div class='input-group'>
          <span className='input-group-text w-25'>Descripcion</span>
          <textarea
            class='form-control w-50'
            readOnly={true}
            value={Tarea.Descripcion || "No hay Descripcion asociada"}
            aria-label='With textarea'
          ></textarea>
        </div>
      </div>
      <div className='row d-flex mt-2 ms-1 w-75'>
        <div class='input-group'>
          <span className='input-group-text w-25'>Observaciones:</span>
          <textarea
            class='form-control w-50'
            readOnly={true}
            value={Tarea.Observaciones || "No hay Observaciones asociadas"}
            aria-label='With textarea'
          ></textarea>
        </div>
      </div>
      <div className='row d-flex mt-2 ms-1'>
        <div className='col'>
          <button
            className='btn btn-primary'
            onClick={() => {
              if (sEstadoTarea === "Realizado") SetsEstadoTarea("Pendiente");
              else SetsEstadoTarea("Realizado");
              // ! Falta Actualizar estado en la base de datos
            }}
          >
            {" "}
            Cambiar a {sEstadoTarea}{" "}
          </button>
        </div>
      </div>
    </Fragment>
  );
}
