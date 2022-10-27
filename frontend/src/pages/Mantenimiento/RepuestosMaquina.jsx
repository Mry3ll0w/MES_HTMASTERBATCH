import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function RepuestosMaquina() {
  //Hooks
  const navigate = useNavigate();

  //UseStates
  const [aMaquina, SetaMaquina] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://${process.env.REACT_APP_SERVER}/Mantenimiento/RepuestosMaquina`
      )
      .catch((e) => console.log(e))
      .then((response) => {
        SetaMaquina(response.data.Maquinas);
      });
  }, []);

  return (
    <Fragment>
      <div></div>
    </Fragment>
  );
}
