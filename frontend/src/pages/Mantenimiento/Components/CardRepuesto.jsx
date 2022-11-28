import React, { Fragment, useState } from "react";
import { Button } from "@mui/material";
import DropDownMenu from "../../../Components/DropDownMenu";
import axios from "axios";
export default function CardRepuesto({
  Reference,
  Description,
  Location,
  Stock,
}) {
  //UseStates
  const [iStock, SetiStock] = useState(1);
  const [iCurrentStock, SetiCurrentStock] = useState(Stock);
  const [sImgUrl, SetsImgUrl] = useState(
    `/materiales/${Reference}.png?random=` + new Date().getTime()
  );
  const [file, setFile] = useState({ data: "" });

  function handleChange(e) {
    const img = {
      data: e.target.files[0],
    };
    setFile(img);
  }

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    
    //Checking dataType
    var [, sFileExtension] = file.data.name.split('.')
    if(sFileExtension !== 'png'){
      alert('Extension de archivo no permitida, suba una imagen png');
    }else{
      let formData = new FormData();
      formData.append("file", file.data,`${Reference}.png`);
      axios
      .post(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina/UpdatePhoto`,
        formData
      )
      .catch((e) => console.log(e));
      SetsImgUrl(`/materiales/${Reference}.png?random=` + new Date().getTime());
    }
  
  };

  const aDropElements = [
    {
      element: (
        <form onSubmit={handleSubmitImage}>
          <input type='file' onChange={handleChange} />
          <br />
          <Button variant='contained' type='submit' sx={{ marginTop: "2%" }}>
            Subir Imagen (*.png)
          </Button>
        </form>
      ),
    },
  ];

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
            src={sImgUrl} // /materiales/Photo.png
            style={{maxWidth: '300px', maxHeight: '300px', minWidth: '200px', minHeight:'100px'}}
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
              <i className='fa fa-heart-o'>
                <div>
                  <DropDownMenu
                    label={"Cambiar imagen del repuesto"}
                    elements={aDropElements}
                  />
                </div>
              </i>
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
