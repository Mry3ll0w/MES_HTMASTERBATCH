import React, { Fragment } from "react";

export default function HorizontalCard() {
  return (
    <Fragment>
      <div className='place-card mb-1'>
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
              Sunway forest
            </a>{" "}
            <a href='#!' className='text-muted'>
              <i className='fa fa-heart-o'></i>
            </a>
          </h4>
          <p>
            <i className='fa fa-map-marker'></i>{" "}
            <span className='text-muted'>Mother Nature</span>
          </p>
          <div className='rating-box'>
            <div className='rating-box__items'>
              <div className='rating-stars'>
                <img src='img/grey-star.svg' alt='' />
              </div>
              <span className='ml-1'>
                <b>4.5</b>
              </span>
            </div>
            <a href='#!' className='text-muted'>
              (55 ratings & 12 Reviews)
            </a>
          </div>
          <p className='text-muted mb-0 d-none d-sm-block'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa
            officiis, in eos, enim repudiandae cum magni eaque deleniti
            repellendus sint saepe quo, excepturi ipsam atque hic laborum fugiat
            maiores rem?
          </p>
        </div>
      </div>
    </Fragment>
  );
}
