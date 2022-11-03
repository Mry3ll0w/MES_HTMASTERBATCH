import React, { Fragment } from "react";

export default function HorizontalCard({
  Reference,
  Description,
  Location,
  Stock,
  Photo,
}) {
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
            <a href='#!' className='text-dark place-title'>
              {Reference}
            </a>{" "}
            <a href='#!' className='text-muted'>
              <i className='fa fa-heart-o'></i>
            </a>
          </h4>
          <p>
            <i className='fa fa-map-marker'></i>{" "}
            <span className='text-muted'>{Description}</span>
          </p>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Ubicacion : {Location}
          </p>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Stock Disponible : {Stock}
          </p>
        </div>
      </div>
    </Fragment>
  );
}
