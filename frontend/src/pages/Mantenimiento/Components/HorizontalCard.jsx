import React, { Fragment, useState } from "react";
import { Button, TextField } from "@mui/material";
import PhotoUploader from "./PhotoUploader";
import axios from "axios";
export default function HorizontalCard({
  Reference,
  Description,
  Location,
  Stock,
  Photo,
}) {
  //UseStates
  const [iStock, SetiStock] = useState(1);
  const [iCurrentStock, SetiCurrentStock] = useState(Stock);
  const [savUploadedPhoto, SetsavUploadedPhoto] = useState("");
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
            src={Photo} // /materiales/Photo.png
            className='place-card__img-thumbnail'
            alt='Error al cargar la imagen'
          />
        </div>
        <div className='place-card__content'>
          <h4 className='place-card__content_header'>
            <span className='text-dark place-title'>
              Referencia : {Reference}
            </span>{" "}
            <a href='#!' className='text-muted'>
              <i className='fa fa-heart-o'></i>
            </a>
          </h4>
          <span>
            <i className='fa fa-map-marker'></i>{" "}
            <span className='text-muted bold'>
              Descripcion : <span className='ml-2'>{Description}</span>
            </span>
          </span>
          <span className='text-muted mb-0 d-none d-sm-block'>
            Ubicacion : {Location}
          </span>
          <span className='text-muted mb-0 d-none d-sm-block'>
            Stock Disponible : {iCurrentStock}{" "}
          </span>
          <span className='text-muted mb-3 d-none d-sm-block mt-3'>
            <div className='row d-flex'>
              <div className='col-6'>
                Sacar Stock:{" "}
                <input
                  type='number'
                  value={iStock}
                  style={{ textAlign: "center", width: "80px" }}
                  onChange={(e) => SetiStock(e.target.value)}
                  min='1'
                />{" "}
              </div>
              <div className='col-6'>
                <PhotoUploader url='/Mantenimiento/RepuestosMaquina/UpdatePhoto' />
              </div>
            </div>
          </span>
          <div className='row d-flex'>
            <div className='col-6'>
              <Button variant='contained' size='small' onClick={UpdateStock}>
                Actualizar Stock del repuesto
              </Button>
            </div>
            <div className='col-6'></div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
