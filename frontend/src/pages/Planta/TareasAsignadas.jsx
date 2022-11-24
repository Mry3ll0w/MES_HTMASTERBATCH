import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DetallesTarea from "./Components/DetallesTarea";

export default function TareasAsignadas() {
  //UseStates
  const [aTareas, SetaTareas] = useState([]);
  const [Tarea, SetTarea] = useState([]);
  const [Accion, SetAccion] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      sessionStorage.getItem("codigo") === null ||
      sessionStorage.getItem("iniciales") === null
    ) {
      navigate("/Login");
    }

    axios
      .post(`http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas`, {
        Codigo: sessionStorage.getItem("codigo"),
      })
      .catch((e) => console.log(e))
      .then((response) => {
        SetaTareas(response.data.Tareas);
      });
  }, []);

  function TareaDetalle(id) {
    axios
      .post(
        `http://${process.env.REACT_APP_SERVER}/Planta/TareasAsignadas/DetallesTarea`,
        {
          TareaID: id,
        }
      )
      .catch((e) => console.log(e))
      .then((response) => {
        SetAccion(response.data.Accion);
        SetTarea(response.data.Tarea);
      });
  }
  function DispDetalles() {
    if (Tarea.length !== 0) return <DetallesTarea Tarea={Tarea} Accion={Accion} />;
  }

  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <p className="h3 d-flex justify-content-center">
            Tareas pendientes asignadas {aTareas.length}:{" "}
          </p>
        </div>
        <div className="row d-inline">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="border-start border-end text-center">
                  #
                </th>
                <th scope="col" className="border-start border-end text-center">
                  Codigo
                </th>
                <th scope="col" className="border-start border-end text-center">
                  Criticidad
                </th>
                <th scope="col" className="border-start border-end text-center">
                  Descripcion
                </th>
                <th scope="col" className="border-start border-end text-center">
                  F.Programada
                </th>
                <th scope="col" className="border-start border-end text-center">
                  T.Estimado
                </th>
                <th scope="col" className="border-start border-end text-center">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody>
              {aTareas.map((i, n) => {
                return (
                  <tr>
                    <td className="border-start border-end text-center">
                      {n + 1}
                    </td>
                    <td className="border-start border-end text-center">
                      {i.Codigo}
                    </td>
                    <td className="border-start border-end text-center">
                      {i.Criticidad}
                    </td>
                    <td className="border-start border-end">{i.Descripcion}</td>
                    <td className="border-start border-end text-center">
                      {i.FechaProgramada}
                    </td>
                    <td className="border-start border-end text-center">
                      {i.TiempoEstimado}
                    </td>
                    <td className="border-start border-end text-center">
                      <button
                        type="button"
                        onClick={() => TareaDetalle(i.ID)}
                        className="btn btn-primary"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="row d-flex">{DispDetalles()}</div>
      </div>
    </Fragment>
  );
}
