import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import { useState } from "react";
import { Drawer } from "@mui/material";
import { styles } from "../Style/styles";
import { useNavigate } from "react-router-dom";
import HomeProduccion from "../pages/menu_departamentos/Produccion";
import HomeMantenimiento from "../pages/menu_departamentos/Mantenimiento";
import HomePlanta from "../pages/menu_departamentos/Planta";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

export function Header() {
  //Gestiona apertura o cierre del drawer
  const [OpenMenu, openmenu] = useState(false);

  //Navegabilidad de los botones
  const navigate = useNavigate();
  const [On_Login, setOnLogin] = useState(() => {
    if (window.location.href === "http://192.168.0.118:3000/Login") {
      return true;
    } else {
      return false;
    }
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            onClick={() => {
              openmenu(true);
            }}
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            disabled={On_Login}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            MES UNNOX-HT
          </Typography>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, textAlign: "left", marginLeft: "65%" }}
          >
            <Button
              style={styles.buttons}
              onClick={() => {
                navigate("/Login");
                openmenu(false);
                sessionStorage.clear();
                setOnLogin(true);
              }}
              variant='contained'
              hidden={On_Login}
            >
              Cerrar sesion {sessionStorage.getItem("logged")}
            </Button>
          </Typography>
        </Toolbar>

        <Drawer
          style={styles.drawer}
          open={OpenMenu}
          onClose={() => {
            openmenu(false);
          }}
        >
          <Box sx={{ width: "400px", marginTop: "20px" }}>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              Departamentos
            </Typography>
            <Button
              style={styles.buttons}
              onClick={() => {
                navigate("/profile");
                openmenu(false);
              }}
              variant='contained'
              type='password'
            >
              Perfil
            </Button>
            <br />
            <Button
              style={styles.buttons}
              onClick={() => {
                navigate("/home");
                openmenu(false);
              }}
              variant='contained'
            >
              Mi Departamento
            </Button>
            <Button
              style={styles.buttons}
              onClick={() => {
                navigate("/DepartamentoMantenimiento");
                openmenu(false);
              }}
              variant='contained'
            >
              Departamento de Mantenimiento
            </Button>
            <Button
              style={styles.buttons}
              onClick={() => {
                navigate("/DepartamentoProduccion");
                openmenu(false);
              }}
              variant='contained'
            >
              Departamento de Produccion
            </Button>
            <br />
            <Button
              style={styles.buttons}
              onClick={() => {
                navigate("/Planta");
                openmenu(false);
              }}
              variant='contained'
            >
              Planta
            </Button>
          </Box>
        </Drawer>
      </AppBar>
    </Box>
  );
}
