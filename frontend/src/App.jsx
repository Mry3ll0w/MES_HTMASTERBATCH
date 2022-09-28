import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './pages/home';
import Estadistico from './pages/estadistico';
import ErrorPage from './pages/ErrorPage';
import EjParam from './pages/EjParam';
import RegEnsacado from './pages/Reg_Ensacado';
import LoginForm from './pages/LoginForm';
import RegistroPlanta from './pages/RegistroPlanta';
import { Header } from './Components/Header';
import { styles} from './Style/styles';
import Footer from './Components/Footer';
import { useEffect } from 'react';
import Grafica_Estadistico from './pages/grafica_estadistico';
import Profile from './pages/Profile';
import TrazabilidadRegPlanta from './Components/Trazabilidad';
import GestionResiduos from './Components/GestionResiduos';
//Imagenes
import Personal from './pages/AdminUsers';
import HomeProduccion from './pages/Produccion';
import HomeMantenimiento from './pages/Mantenimiento';
let loggeduser=''
export function App() {

  useEffect(()=>{
      document.title = 'MES'
      
  });

  return (
    <Router>
      <Header />
      <div style={styles.home_div}>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/estadistico" element={<Estadistico />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/ejparam/:username" element={<EjParam />} />
          <Route path="/RegEnsacado" element={<RegEnsacado />} />
          <Route path="/GraficaEstadistico" element={<Grafica_Estadistico />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Personal" element={<Personal />} />
          <Route path="/RegistroPlanta" element={<RegistroPlanta />} />
          <Route path='/RegistroPlanta/Trazabilidad' element={<TrazabilidadRegPlanta />} />
          <Route path='/RegistroPlanta/GestionDesperdicio' element={<GestionResiduos />} />
          <Route path='/DepartamentoProduccion' element={<HomeProduccion />} />
          <Route path='/DepartamentoMantenimiento' element={<HomeMantenimiento />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
