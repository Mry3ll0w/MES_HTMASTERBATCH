import axios from "axios";
import React, { Fragment, useState, useEffect} from "react";
import DetallesTareaAccion from "./DetallesTareaAccion";
export default function DetallesTarea({
  Tarea,
  Accion,
}) {
  //UseStates
  const [sEstadoTarea, SetsEstadoTarea] = useState("");
  useEffect(() => {
    if (Tarea.EstadoTarea === "Pendiente") SetsEstadoTarea("Realizado");
    else if (Tarea.EstadoTarea === "Realizado") SetsEstadoTarea("Pendiente");
  }, []);
  return (
    <Fragment>
      <div>
        <div className="row d-inline ms-1 mb-3">
        <h3 className="d-inline mb-3">Datos de la Tarea</h3>
      </div>
      <div className="row d-flex ms-1">
        <div className="col">
          <p className="h5 mt-4">Codigo de la Tarea: {Tarea.Codigo}</p>
        </div>
        <div className="col">
          <p className="h5 mt-4">
            {" "}
            Fecha Programada :{" "}
            <input
              type="date"
              style={{ padding: "3px" }}
              readOnly={true}
              value={Tarea.FechaProgramada}
            />
          </p>
        </div>
      </div>
      <div className="row d-flex mt-2 ms-1">
        <div className="col">
          <p className="h5"> Criticidad : {Tarea.Criticidad} </p>
        </div>
        <div className="col">
          <p className="h5">
            {" "}
            Estado (inicial) de la Tarea: {Tarea.EstadoTarea}{" "}
          </p>
        </div>
      </div>
      <div className="row d-flex mt-2 ms-1 w-75">
        <div className="input-group">
          <span className="input-group-text w-25">Descripcion</span>
          <textarea
            className="form-control w-50"
            readOnly={true}
            value={Tarea.Descripcion || "No hay Descripcion asociada"}
            aria-label="With textarea"
          ></textarea>
        </div>
      </div>
      <div className="row d-flex mt-2 ms-1 w-75">
        <div className="input-group">
          <span className="input-group-text w-25">Observaciones:</span>
          <textarea
            className="form-control w-50"
            readOnly={true}
            value={Tarea.Observaciones || "No hay Observaciones asociadas"}
            aria-label="With textarea"
          ></textarea>
        </div>
      </div>
      <div className="row d-flex mt-2 ms-1">
        <div className="col">
          <button
            
            className="btn btn-primary d-print-none"
            onClick={() => {
              axios.post(
                `http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas/DetallesTarea/UpdateEstadoTarea`,
                {
                  iTareaID : Tarea.ID
                }
              )
              .catch( e => {
                console.log(e);
                alert('Error cambiando el estado de la tarea')
              })
            }}
          >
            {" "}
            Cambiar a {sEstadoTarea}{" "}
          </button>
        </div>
      </div>
      <div className="row d-flex mt-2 ms-1" style={{pageBreakAfter : 'always'}}>
        <div className="container d-flex">
          <div className="row mt-3 mb-3">
            <h3> Acciones vinculadas </h3>
          </div>
        </div>
        {Accion.map((i, n) => {
          return (
            <div id={n+1} className='printDiv'>
              <div className="container d-flex" style={{pageBreakBefore : 'always'}}>
                <div className="row d-flex">
                  <div className="input-group w-75">
                    <span className="input-group-text w-25 justify-content-center h-100">
                      Accion Nº {n+1}{" "}
                    </span>
                    <p className="form-control w-75 h-100">{i.Descripcion}</p>
                  </div>
                  <div className="input-group w-75 mt-3">
                    <span className="input-group-text w-25 justify-content-center h-100">
                      Observaciones{" "}
                    </span>
                      <p className="form-control w-75 h-100">{i.Observaciones || 'No hay notas asociadas'}</p>
                  </div>
                  <div className="row d-flex mt-3 mb-3">
                    <p className="h3">Empleados Implicados en la Acción</p>
                  </div>
                  <div className="row d-flex">
                    <DetallesTareaAccion AccionID={i.ID} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      
    </Fragment>
  );
}
