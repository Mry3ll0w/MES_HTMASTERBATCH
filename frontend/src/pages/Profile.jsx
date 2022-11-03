import React, { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import axios from "axios";
import { Button, TextField } from "@mui/material";

const bcrypt = require("bcryptjs");
export default function Profile() {
  const [User, setUser] = useState([]);
  const [Pass, setPass] = useState("");
  const [OldPass, setOldPass] = useState("");
  const [OldPassErr, setOldPassErr] = useState(false);
  const [PassError, setPassError] = useState(false);

  //Para los focus
  const RefNewPass = useRef(null);

  useEffect(() => {
    axios
      .get(
        `http://${
          process.env.REACT_APP_SERVER
        }/Profile/${sessionStorage.getItem("codigo")}`
      )
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => console.log(error));
  }, []);

  const navigate = useNavigate();
  const nav_login = () => {
    navigate("/Login");
  };

  if (sessionStorage.getItem("logged") === null) {
    nav_login();
    alert(
      "Para acceder a esta pagina necesita iniciar sesión, pida a un administrador que le de de alta o acceda con su usuario"
    );
  }
  function handlePass() {
    var ok = true;

    if (Pass === "") {
      alert("No dejes la contraseña en blanco");
      setPassError(true);
      ok = false;
    } else {
      setPassError(false);
    }

    if (OldPass === "") {
      alert("No dejes la nueva contraseña en blanco");
      setOldPassErr(true);
      ok = false;
    } else {
      setOldPassErr(false);
    }

    if (Pass === OldPass) {
      alert("La contraseña no puede ser la misma que la anterior");
      setPassError(true);
      setOldPassErr(true);
      ok = false;
    } else {
      setPassError(false);
      setOldPassErr(false);
    }

    //La contraseña anterior no es correcta
    if (!bcrypt.compareSync(OldPass, User[0].Pwd_Hashed)) {
      alert("La contraseña anterior no es correcta");
      setOldPassErr(true);
      ok = false;
    } else {
      setOldPassErr(false);
    }
    var error;
    if (ok) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(Pass, salt);
      axios
        .post(`http://${process.env.REACT_APP_SERVER}/Profile`, {
          NewPass: hash,
          Codigo: sessionStorage.getItem("codigo"),
        })
        .catch((e) => (error = e));
      if (error) {
        alert("Error al actualizar la contraseña");
      } else {
        alert("Contraseña actualizada correctamente");
        window.location.reload(false);
      }
    }
  }
  return (
    <Fragment>
      <div>
        <h1>Bienvenido {sessionStorage.getItem("logged")}</h1>
        <Box sx={{ border: "1px dashed grey", width: "60%" }}>
          <div>
            <h2>¿ Quieres cambiar tu contraseña ?</h2>
            <TextField
              label='Introduce la contraseña anterior'
              sx={{ width: "300px", margin: 2 }}
              type='password'
              value={OldPass}
              onChange={(e) => setOldPass(e.target.value)}
              error={OldPassErr}
              inputProps={{
                onKeyPress: (event) => {
                  const { key } = event;
                  console.log(key);
                  if (key === "Enter") {
                    RefNewPass.current.focus();
                  }
                },
              }}
            />
            <br />
            <TextField
              label='Nueva Contraseña'
              sx={{ width: "300px", margin: 2 }}
              type='password'
              value={Pass}
              onChange={(e) => setPass(e.target.value)}
              error={PassError}
              inputRef={RefNewPass}
            />
            <br />
            <Button sx={{ margin: 2 }} onClick={handlePass} variant='contained'>
              Cambiar contraseña
            </Button>
          </div>
        </Box>
      </div>
    </Fragment>
  );
}
