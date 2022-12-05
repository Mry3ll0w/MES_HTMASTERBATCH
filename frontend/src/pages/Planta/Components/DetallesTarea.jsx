import axios from "axios";
import React, { Fragment, useState, useEffect} from "react";
import luxon, { DateTime } from 'luxon'
import DetallesTareaEmpleados from "./DetallesTareaEmpleados";
import DeteallesTareaMateriales from "./DetallesTareaMateriales";
export default function DetallesTarea({
  Tarea,
  Accion,
}) {

  //useStates
  const [accion,setaccion] = useState(Accion);

  //Funciones
  function addAction(){
        var dNow = DateTime.now();
        axios.post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/NewAccion`,
          {
            TAREAID: Tarea.ID,
            FechaHora: dNow.toISODate().toString(),
          }
        ).catch(e => alert('Error en la agregacion a la base de datos'))
        window.location.reload(false)
        
    }

  function eraseAction(ID){
    axios.post(`http://${process.env.REACT_APP_SERVER}/Mantenimiento/DelAccion`,{AccionID: ID})
    .catch(e =>{
      alert('Error en el borrado de la accion, comprueba el estado del servidor')
      console.log(e)
    })
    window.location.reload(false)
    ;
  }

  function updateAccion(Accion) {
    //Comprobamos que tenga al menos un empleado asignado a la accion
    if (Accion !== undefined && Accion !== null) {
      axios
        .post(
          `http://${process.env.REACT_APP_SERVER}/Mantenimiento/UpdateAccion`,
          {
            Accion: {
              ID: Accion.ID,
              Accion: Accion.Descripcion,
              FechaHora: Accion.FechaCreacion,
              Notas: Accion.Notas
            }
          }
        )
        .catch((e) => console.table(e));
      //fetchSelectedAction();
    }
    
  }

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
            onFocus={(event) => event.target.select()}
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
          <button className="btn btn-primary ms-3 d-print-none" onClick={()=> addAction()}>
            Agregar Accion
          </button>
        </div>
      </div>
      <div className="row d-flex mt-2 ms-1" style={{pageBreakAfter : 'always'}}>
        <div className="container d-flex">
          <div className="row mt-3 mb-3">
            <h3> Acciones vinculadas </h3>
          </div>
        </div>
        {accion.map((i, n) => {
          return (
            <div id={n+1} className='printDiv'>
              <div className="container d-flex border border-dark" style={{pageBreakBefore : 'always'}}>
                <div className="row d-flex mt-4">
                  <div className="row">
                    <button className="btn btn-primary ms-3 d-print-none mb-3" style={{width: '200px'}} onClick={()=> eraseAction(i.ID)}>
                    Eliminar Accion
                    </button>
                    <button className="btn btn-primary ms-3 d-print-none mb-3" style={{width: '200px'}} onClick={()=> updateAccion(i)}>
                      Actualizar accion
                    </button>
                  </div>
                  <div className="input-group w-75">
                    <span className="input-group-text w-25 justify-content-center h-100">
                      Accion Nº {n+1}{" "}
                    </span>
                    <textarea 
                      className="form-control w-75 h-100"
                      value={i.Descripcion}
                      onChange={(e)=>{
                        setaccion(
                                  accion.map((j) =>
                                    j.ID === i.ID
                                      ? { ...j,Descripcion: e.target.value }
                                      : j
                                  )
                                );
                      }}
                    >
                    </textarea>
                  </div>
                  <div className="input-group w-75 mt-3">
                    <span className="input-group-text w-25 justify-content-center h-100">
                      Observaciones{" "}
                    </span>
                      <textarea 
                        className="form-control w-75 h-100"
                        value={i.Notas }
                        onChange={(e)=>{
                          setaccion(
                                  accion.map((j) =>
                                    j.ID === i.ID
                                      ? { ...j,Notas: e.target.value }
                                      : j
                                  )
                                );
                        }}
                      >
                      </textarea>
                  </div>
                  <div className="row d-flex mt-3 mb-3">
                    <p className="h3">Empleados Implicados en la Acción</p>
                  </div>
                  <div className="row d-flex">
                    <DetallesTareaEmpleados AccionID={i.ID} />
                  </div>
                  <div className="row d-flex">
                    <DeteallesTareaMateriales AccionID={i.ID} />
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
