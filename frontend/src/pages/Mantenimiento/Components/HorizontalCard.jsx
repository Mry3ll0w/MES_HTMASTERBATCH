import React, { Fragment, useState } from "react";
import { Button } from "@mui/material";
export default function HorizontalCard({
  Reference,
  Description,
  Location,
  Stock,
  Photo,
  StockMin,
}) {
  //UseStates
  const [iStock, SetiStock] = useState(0);

  /**
   * Funcion encargada de actualizar y comprobar el stock del producto en cuestion
   */
  function UpdateStock() {}

  return (
    <Fragment>
      <div className='place-card mb-2'>
        <div className='place-card__img'>
          <img
            src='https://media-exp1.licdn.com/dms/image/C4E12AQFtK24TMxJIcw/article-cover_image-shrink_720_1280/0/1549248731409?e=2147483647&v=beta&t=L-fz28DnZtaAwyj7PKo2jSQY4SGDfA4TjNUtplFti_E'
            className='place-card__img-thumbnail'
            alt='Thumbnail'
          />
        </div>
        <div className='place-card__content'>
          <h4 className='place-card__content_header'>
            <p className='text-dark place-title'>Referencia :{Reference}</p>{" "}
            <a href='#!' className='text-muted'>
              <i className='fa fa-heart-o'></i>
            </a>
          </h4>
          <p>
            <i className='fa fa-map-marker'></i>{" "}
            <span className='text-muted'>
              Descripcion : <br />
              {Description}
            </span>
          </p>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Ubicacion : {Location}
          </p>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Stock Disponible : {Stock}{" "}
          </p>
          <p className='text-muted mb-3 d-none d-sm-block mt-3'>
            Sacar Stock: <input type='number' min={0} />{" "}
          </p>

          <Button variant='contained' size='small' onClick={UpdateStock}>
            Actualizar Stock
          </Button>
        </div>
      </div>
    </Fragment>
  );
}
