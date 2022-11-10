import React, { Fragment, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
export default function HorizontalCard({
  Reference,
  Description,
  Location,
  Stock,
  Photo,
  StockMin,
}) {
  //UseStates
  const [iStock, SetiStock] = useState(1);
  const [iCurrentStock, SetiCurrentStock] = useState(Stock);
  /**
   * Funcion encargada de actualizar y comprobar el stock del producto en cuestion
   */
  function UpdateStock() {
    axios
      .post(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina/UpdateStock`,
        { iMatID: Reference, iSubstract: iStock }
      )
      .catch((e) => {
        console.error(e);
        alert(
          "Error en la actualizacion, consulte el estado de la base de datos"
        );
      });
    alert("Stock actualizado");
    FetchMachineStock(Reference);
  }

  function FetchMachineStock(ID) {
    axios
      .get(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina/Stock/${ID}`
      )
      .catch((e) => console.log(e))
      .then((response) => {
        SetiCurrentStock(response.data.Stock);
      });
  }

  return (
    <Fragment>
      <div className='place-card mb-2'>
        <div className='place-card__img'>
          <img
            src='/materiales/repuesto.png'
            className='place-card__img-thumbnail'
            alt='Error al captar la imagen'
          />
        </div>
        <div className='place-card__content'>
          <h4 className='place-card__content_header'>
            <p className='text-dark place-title'>Referencia : {Reference}</p>{" "}
            <a href='#!' className='text-muted'>
              <i className='fa fa-heart-o'></i>
            </a>
          </h4>
          <p>
            <i className='fa fa-map-marker'></i>{" "}
            <span className='text-muted bold'>
              Descripcion : <span className='ml-2'>{Description}</span>
            </span>
          </p>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Ubicacion : {Location}
          </p>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Stock Disponible : {iCurrentStock}{" "}
          </p>
          <p className='text-muted mb-3 d-none d-sm-block mt-3'>
            Sacar Stock:{" "}
            <input
              type='number'
              value={iStock}
              style={{ textAlign: "center", width: "80px" }}
              onChange={(e) => SetiStock(e.target.value)}
              min='1'
            />{" "}
          </p>

          <Button variant='contained' size='small' onClick={UpdateStock}>
            Actualizar Stock del repuesto
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
